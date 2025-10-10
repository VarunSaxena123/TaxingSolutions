from fastapi import FastAPI, HTTPException, Depends, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
import jwt
import os
from dotenv import load_dotenv
import csv
import io
import uuid

from models import (
    UserCreate, UserResponse, UserLogin, UserUpdate,
    ContactCreate, ContactResponse,
    EnquiryCreate, EnquiryResponse,
    NewsletterSubscribe, NewsletterResponse,
    FranchiseResponse, FranchiseCreate
)
from database import (
    create_user, authenticate_user, get_user_by_email, get_user_by_id, list_users, 
    modify_user, remove_user, get_user_role, update_user_role,
    create_contact, list_contacts_all, get_contact, remove_contact,
    create_enquiry, list_enquiries_all, get_enquiry, remove_enquiry,
    subscribe_email, unsubscribe_email, list_newsletter, get_db_connection, reset_user_password,
    get_users_by_franchise, get_all_franchises, get_franchise_by_user_id, generate_unique_referral_code,
    create_franchise, get_franchise_by_referral_code, create_franchise_by_email, delete_franchise
)

# Load environment variables
load_dotenv()

app = FastAPI(title="Simple App Backend", version="2.0.0")

# JWT Secret Key
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:3000",        # React dev server
        "http://localhost:5173",        # Vite dev server
        "http://localhost:8001",        # Backend itself
        "http://localhost:8000"
        "https://your-app-name.onrender.com",
        "https://firebrick-salmon-317086.hostingersite.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health ---
@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat() + "Z"}

# --- Authentication helpers ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

# Authentication middleware
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user

async def require_admin(current_user: dict = Depends(get_current_user)):
    # Check if user has admin role
    if current_user.get("role") not in ["admin", "super_admin", "franchise"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

async def require_super_admin(current_user: dict = Depends(get_current_user)):
    # Check if user has super_admin role
    if current_user.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Super admin access required")
    return current_user

# --- Auth endpoints ---
@app.post("/auth/register", status_code=201)
def register(user: UserCreate):
    print(f"[REGISTER ATTEMPT] Email: {user.email}")

    existing = get_user_by_email(user.email)
    if existing:
        print("[REGISTER FAILED] Email already exists")
        raise HTTPException(status_code=409, detail="Email already registered")

    try:
        # Set admin role for specific emails
        if user.email in ["varunkanu2000@gmail.com", "paras@gmail.com"]:
            role = "super_admin"
        else:
            role = user.role or "user"
        
        # Validate referral code if provided
        franchise_referral_code = None
        if user.referral_code:
            franchise = get_franchise_by_referral_code(user.referral_code)
            if not franchise:
                raise HTTPException(status_code=400, detail="Invalid referral code")
            franchise_referral_code = user.referral_code
        
        user_id = create_user(
            first_name=user.first_name,
            last_name=user.last_name or "",
            email=user.email,
            company=user.company or "",
            phone=user.phone or "",
            password=user.password.get_secret_value(),
            role=role,
            referral_code=franchise_referral_code
        )
        print(f"[REGISTER SUCCESS] User created with ID: {user_id}, Role: {role}")
        
        # Create access token
        access_token = create_access_token({"sub": str(user_id)})
        
        # Get the created user
        created_user = get_user_by_id(user_id)
        if not created_user:
            raise HTTPException(status_code=500, detail="Failed to fetch created user")

        return {
            "message": "Registration successful", 
            "user_id": user_id, 
            "email": created_user["email"],
            "role": created_user["role"],
            "franchise_code": created_user.get("franchise_code"),
            "referral_code": created_user.get("referral_code"),
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[REGISTER ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login")
def login(user: UserLogin):
    print(f"[LOGIN ATTEMPT] Email: {user.email}")
    db_user = get_user_by_email(user.email)
    if not db_user:
        print("[LOGIN FAILED] Email not found")
        raise HTTPException(status_code=404, detail="User not found")

    if not authenticate_user(user.email, user.password.get_secret_value()):
        print("[LOGIN FAILED] Invalid password")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # If referral code is provided during login, validate and update user
    if user.referral_code:
        franchise = get_franchise_by_referral_code(user.referral_code)
        if not franchise:
            raise HTTPException(status_code=400, detail="Invalid referral code")
        
        # Update user with referral code
        conn = get_db_connection()
        conn.execute(
            'UPDATE users SET referral_code = ? WHERE id = ?',
            (user.referral_code, db_user["id"])
        )
        conn.commit()
        conn.close()
        print(f"[LOGIN] User {db_user['email']} updated with referral code: {user.referral_code}")

    # Create access token
    access_token = create_access_token({"sub": str(db_user["id"])})
    
    print(f"[LOGIN SUCCESS] User ID: {db_user['id']}, Role: {db_user.get('role', 'user')}")
    return {
        "message": "Login successful", 
        "user_id": db_user["id"], 
        "email": db_user["email"],
        "role": db_user.get("role", "user"),
        "franchise_code": db_user.get("franchise_code"),
        "referral_code": db_user.get("referral_code"),
        "access_token": access_token,
        "token_type": "bearer"
    }

# Google OAuth endpoint (placeholder)
@app.get("/auth/google")
def google_auth():
    # This would normally redirect to Google's OAuth endpoint
    return {"message": "Google OAuth not implemented yet"}

# --- Admin endpoints ---
@app.get("/admin/users", response_model=List[UserResponse])
def get_all_users(current_user: dict = Depends(require_admin)):
    try:
        # Super admin can see all users, franchise admin can only see their users
        if current_user.get("role") == "super_admin":
            rows = list_users()
        else:
            # Franchise admin can only see users who signed up with their referral code
            franchise_code = current_user.get("franchise_code")
            if not franchise_code:
                raise HTTPException(status_code=403, detail="No franchise association found")
            # Fixed: Use the correct function to get users by franchise code
            rows = get_users_by_franchise(franchise_code)
        
        return [
            UserResponse(
                id=r["id"],
                first_name=r["first_name"],
                last_name=r["last_name"],
                email=r["email"],
                company=r["company"],
                phone=r["phone"],
                role=r["role"],
                franchise_code=r.get("franchise_code"),
                referral_code=r.get("referral_code"),
                created_at=datetime.fromisoformat(r["created_at"])
            )
            for r in rows
        ]
    except Exception as e:
        print(f"Error in get_all_users: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/admin/users/{user_id}/role")
def update_user_role_endpoint(user_id: int, payload: dict, current_user: dict = Depends(require_admin)):
    # Only super admin can change roles
    if current_user.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Only super admin can change roles")
    
    role = payload.get("role")
    if role not in ["user", "franchise", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'user', 'franchise', or 'admin'")
    
    # Prevent changing roles of super admins
    target_user = get_user_by_id(user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target_user.get("email") in ["varunkanu2000@gmail.com", "paras@gmail.com"]:
        raise HTTPException(status_code=403, detail="Cannot change role of super admin users")
    
    success = update_user_role(user_id, role)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update user role")
    
    # If role is franchise, generate a referral code and create franchise entry
    if role == "franchise":
        referral_code = generate_unique_referral_code()
        franchise_name = f"{target_user['first_name']} {target_user['last_name']}"
        create_franchise(user_id, franchise_name, referral_code)
        # Update user with franchise code
        conn = get_db_connection()
        conn.execute('UPDATE users SET franchise_code = ? WHERE id = ?', (referral_code, user_id))
        conn.commit()
        conn.close()
    
    return {"message": "User role updated successfully"}

# --- Franchise endpoints ---
@app.get("/admin/franchises", response_model=List[FranchiseResponse])
def get_all_franchises_endpoint(current_user: dict = Depends(require_super_admin)):
    try:
        franchises = get_all_franchises()
        return [
            FranchiseResponse(
                id=f["id"],
                user_id=f["user_id"],
                franchise_name=f["franchise_name"],
                referral_code=f["referral_code"],
                first_name=f.get("first_name"),
                last_name=f.get("last_name"),
                email=f.get("email"),
                created_at=datetime.fromisoformat(f["created_at"])
            )
            for f in franchises
        ]
    except Exception as e:
        print(f"Error in get_all_franchises_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/admin/franchises", response_model=FranchiseResponse, status_code=201)
def create_franchise_endpoint(payload: FranchiseCreate, current_user: dict = Depends(require_super_admin)):
    try:
        print(f"Received franchise creation request for email: {payload.email}")
        
        franchise_id = create_franchise_by_email(payload.email, payload.franchise_name)
        
        # Get the created franchise
        conn = get_db_connection()
        franchise = conn.execute('''
            SELECT f.*, u.first_name, u.last_name, u.email 
            FROM franchises f 
            JOIN users u ON f.user_id = u.id 
            WHERE f.id = ?
        ''', (franchise_id,)).fetchone()
        
        if not franchise:
            raise HTTPException(status_code=500, detail="Failed to fetch created franchise")
        
        # Convert Row to dict
        franchise_dict = dict(franchise)
        
        return FranchiseResponse(
            id=franchise_dict["id"],
            user_id=franchise_dict["user_id"],
            franchise_name=franchise_dict["franchise_name"],
            referral_code=franchise_dict["referral_code"],
            first_name=franchise_dict.get("first_name"),
            last_name=franchise_dict.get("last_name"),
            email=franchise_dict.get("email"),
            created_at=datetime.fromisoformat(franchise_dict["created_at"])
        )
        
    except Exception as e:
        print(f"Error in create_franchise_endpoint: {e}")
        error_msg = str(e)
        
        # Handle specific error cases
        if "already a franchise" in error_msg:
            raise HTTPException(status_code=400, detail="User is already a franchise")
        elif "UNIQUE constraint failed" in error_msg:
            raise HTTPException(status_code=400, detail="Franchise with this email already exists")
        elif "Database error" in error_msg:
            raise HTTPException(status_code=500, detail="Database error occurred")
        else:
            raise HTTPException(status_code=500, detail=f"Failed to create franchise: {error_msg}")

@app.delete("/admin/franchises/{franchise_id}")
def delete_franchise_endpoint(franchise_id: int, current_user: dict = Depends(require_super_admin)):
    success = delete_franchise(franchise_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete franchise")
    return {"message": "Franchise deleted successfully"}

# --- Export endpoints ---
@app.get("/admin/export/users")
def export_users_csv(current_user: dict = Depends(require_admin)):
    try:
        # Get users based on role
        if current_user.get("role") == "super_admin":
            users = list_users()
        else:
            franchise_code = current_user.get("franchise_code")
            if not franchise_code:
                raise HTTPException(status_code=403, detail="No franchise association found")
            users = get_users_by_franchise(franchise_code)
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(["ID", "First Name", "Last Name", "Email", "Company", "Phone", "Role", "Franchise Code", "Referral Code", "Created At"])
        
        # Write data
        for user in users:
            writer.writerow([
                user["id"],
                user["first_name"],
                user["last_name"] or "",
                user["email"],
                user["company"] or "",
                user["phone"] or "",
                user["role"],
                user.get("franchise_code") or "",
                user.get("referral_code") or "",
                user["created_at"]
            ])
        
        # Return CSV file
        output.seek(0)
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=users_export.csv"}
        )
    except Exception as e:
        print(f"Error in export_users_csv: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# --- Users CRUD ---
@app.get("/users", response_model=List[UserResponse])
def get_users():
    rows = list_users()
    return [
        UserResponse(
            id=r["id"],
            first_name=r["first_name"],
            last_name=r["last_name"],
            email=r["email"],
            company=r["company"],
            phone=r["phone"],
            role=r["role"],
            created_at=datetime.fromisoformat(r["created_at"])
        )
        for r in rows
    ]

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user_detail(user_id: int):
    r = get_user_by_id(user_id)
    if not r:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=r["id"],
        first_name=r["first_name"],
        last_name=r["last_name"],
        email=r["email"],
        company=r["company"],
        phone=r["phone"],
        role=r["role"],
        created_at=datetime.fromisoformat(r["created_at"])
    )

@app.put("/users/{user_id}")
def update_user(user_id: int, payload: UserUpdate):
    r = get_user_by_id(user_id)
    if not r:
        raise HTTPException(status_code=404, detail="User not found")
    ok = modify_user(
        user_id,
        payload.first_name,
        payload.last_name,
        payload.email,
        payload.company,
        payload.phone
    )
    if not ok:
        raise HTTPException(status_code=400, detail="Nothing to update")
    return {"message": "User updated successfully"}

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    r = get_user_by_id(user_id)
    if not r:
        raise HTTPException(status_code=404, detail="User not found")
    if not remove_user(user_id):
        raise HTTPException(status_code=500, detail="Delete failed")
    return {"message": "User deleted successfully"}

# --- Contact ---
@app.post("/contact", response_model=ContactResponse, status_code=201)
def submit_contact(payload: ContactCreate):
    cid = create_contact(payload.name, payload.email, payload.message)
    # fetch back
    row = next((r for r in list_contacts_all() if r["id"] == cid), None)
    return ContactResponse(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        message=row["message"],
        created_at=datetime.fromisoformat(row["created_at"])
    )

@app.get("/contact", response_model=List[ContactResponse])
def get_contacts():
    rows = list_contacts_all()
    return [
        ContactResponse(
            id=r["id"],
            name=r["name"],
            email=r["email"],
            message=r["message"],
            created_at=datetime.fromisoformat(r["created_at"])
        ) for r in rows
    ]

@app.get("/contact/{contact_id}", response_model=ContactResponse)
def get_contact_by_id(contact_id: int):
    r = get_contact(contact_id)
    if not r:
        raise HTTPException(status_code=404, detail="Contact not found")
    return ContactResponse(
        id=r["id"], name=r["name"], email=r["email"], message=r["message"],
        created_at=datetime.fromisoformat(r["created_at"])
    )

@app.delete("/contact/{contact_id}")
def delete_contact(contact_id: int):
    r = get_contact(contact_id)
    if not r:
        raise HTTPException(status_code=404, detail="Contact not found")
    if not remove_contact(contact_id):
        raise HTTPException(status_code=500, detail="Delete failed")
    return {"message": "Contact deleted successfully"}

# --- Enquiries ---
@app.post("/enquiries", response_model=EnquiryResponse, status_code=201)
def submit_enquiry(payload: EnquiryCreate):
    eid = create_enquiry(payload.model_dump())
    r = get_enquiry(eid)
    return EnquiryResponse(
        id=r["id"],
        firstName=r["first_name"],
        lastName=r["last_name"],
        email=r["email"],
        phone=r["phone"],
        company=r["company"],
        jobTitle=r["job_title"],
        serviceType=r["service_type"],
        budget=r["budget"],
        timeline=r["timeline"],
        message=r["message"],
        howDidYouHear=r["how_did_you_hear"],
        created_at=datetime.fromisoformat(r["created_at"])
    )

@app.get("/enquiries", response_model=List[EnquiryResponse])
def get_enquiries():
    rows = list_enquiries_all()
    return [
        EnquiryResponse(
            id=r["id"],
            firstName=r["first_name"],
            lastName=r["last_name"],
            email=r["email"],
            phone=r["phone"],
            company=r["company"],
            jobTitle=r["job_title"],
            serviceType=r["service_type"],
            budget=r["budget"],
            timeline=r["timeline"],
            message=r["message"],
            howDidYouHear=r["how_did_you_hear"],
            created_at=datetime.fromisoformat(r["created_at"])
        )
        for r in rows
    ]

@app.get("/enquiries/{enquiry_id}", response_model=EnquiryResponse)
def get_enquiry_by_id(enquiry_id: int):
    r = get_enquiry(enquiry_id)
    if not r:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return EnquiryResponse(
        id=r["id"],
        firstName=r["first_name"],
        lastName=r["last_name"],
        email=r["email"],
        phone=r["phone"],
        company=r["company"],
        jobTitle=r["job_title"],
        serviceType=r["service_type"],
        budget=r["budget"],
        timeline=r["timeline"],
        message=r["message"],
        howDidYouHear=r["how_did_you_hear"],
        created_at=datetime.fromisoformat(r["created_at"])
    )

@app.delete("/enquiries/{enquiry_id}")
def delete_enquiry(enquiry_id: int):
    r = get_enquiry(enquiry_id)
    if not r:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    if not remove_enquiry(enquiry_id):
        raise HTTPException(status_code=500, detail="Delete failed")
    return {"message": "Enquiry deleted successfully"}

# --- Newsletter ---
@app.post("/newsletter/subscribe", response_model=NewsletterResponse, status_code=201)
def subscribe(payload: NewsletterSubscribe):
    nid = subscribe_email(payload.email)
    row = next((r for r in list_newsletter() if r["id"] == nid), None)
    return NewsletterResponse(
        id=row["id"],
        email=row["email"],
        status=row["status"],
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]) if row["updated_at"] else None
    )

@app.post("/newsletter/unsubscribe")
def unsubscribe(payload: NewsletterSubscribe):
    if not unsubscribe_email(payload.email):
        raise HTTPException(status_code=404, detail="Email not found")
    return {"message": "Unsubscribed"}

@app.get("/newsletter", response_model=List[NewsletterResponse])
def get_newsletter_list():
    rows = list_newsletter()
    return [
        NewsletterResponse(
            id=r["id"],
            email=r["email"],
            status=r["status"],
            created_at=datetime.fromisoformat(r["created_at"]),
            updated_at=datetime.fromisoformat(r["updated_at"]) if r["updated_at"] else None
        )
        for r in rows
    ]

# --- User profile endpoint ---
@app.get("/users/me", response_model=UserResponse)
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        first_name=current_user["first_name"],
        last_name=current_user["last_name"],
        email=current_user["email"],
        company=current_user["company"],
        phone=current_user["phone"],
        role=current_user["role"],
        franchise_code=current_user.get("franchise_code"),
        referral_code=current_user.get("referral_code"),
        created_at=datetime.fromisoformat(current_user["created_at"])
    )

# --- Debug endpoints ---
@app.get("/debug/users")
def debug_users():
    """Debug endpoint to see all users"""
    try:
        conn = get_db_connection()
        users = conn.execute('SELECT id, first_name, last_name, email, role, franchise_code, referral_code FROM users ORDER BY id').fetchall()
        conn.close()
        return {"users": [dict(user) for user in users]}
    except Exception as e:
        return {"error": str(e)}

@app.get("/debug/franchises")
def debug_franchises():
    """Debug endpoint to see all franchises"""
    try:
        conn = get_db_connection()
        franchises = conn.execute('''
            SELECT f.*, u.email, u.first_name, u.last_name 
            FROM franchises f 
            LEFT JOIN users u ON f.user_id = u.id 
            ORDER BY f.id
        ''').fetchall()
        conn.close()
        return {"franchises": [dict(f) for f in franchises]}
    except Exception as e:
        return {"error": str(e)}

@app.post("/debug/reset-password")
def debug_reset_password(email: str, new_password: str):
    """Debug endpoint to reset a user's password"""
    success = reset_user_password(email, new_password)
    if success:
        return {"message": f"Password reset for {email}"}
    else:
        raise HTTPException(status_code=400, detail=f"Failed to reset password for {email}")
