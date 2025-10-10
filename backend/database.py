import sqlite3
import bcrypt
from datetime import datetime
import uuid

DATABASE_PATH = "users.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    try:
        # Users table - with franchise referral code
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT,
                email TEXT UNIQUE NOT NULL,
                company TEXT,
                phone TEXT,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                franchise_code TEXT,  -- For franchise users to track their referrals
                referral_code TEXT,   -- For users who signed up with a franchise code
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Franchise table to store franchise information
        conn.execute('''
            CREATE TABLE IF NOT EXISTS franchises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                franchise_name TEXT NOT NULL,
                referral_code TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Check if role column exists, if not add it
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'role' not in columns:
            print("Adding missing 'role' column to users table")
            conn.execute('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"')
        
        if 'password_hash' not in columns:
            print("Adding missing 'password_hash' column to users table")
            conn.execute('ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ""')
        
        # Add franchise_code and referral_code columns if they don't exist
        if 'franchise_code' not in columns:
            print("Adding franchise_code column to users table")
            conn.execute('ALTER TABLE users ADD COLUMN franchise_code TEXT')
            
        if 'referral_code' not in columns:
            print("Adding referral_code column to users table")
            conn.execute('ALTER TABLE users ADD COLUMN referral_code TEXT')
        
        # Update existing admin users
        cursor.execute('SELECT * FROM users WHERE email = "varunkanu2000@gmail.com" OR email = "paras@gmail.com"')
        admin_users = cursor.fetchall()
        for admin_user in admin_users:
            conn.execute('UPDATE users SET role = "super_admin" WHERE email = ?', (admin_user['email'],))
            print(f"Updated {admin_user['email']} to super_admin role")
        
        # Contact table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Enquiries table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT,
                email TEXT NOT NULL,
                phone TEXT,
                company TEXT,
                job_title TEXT,
                service_type TEXT,
                budget TEXT,
                timeline TEXT,
                message TEXT NOT NULL,
                how_did_you_hear TEXT,
                franchise_code TEXT,  -- Track which franchise this enquiry came from
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Newsletter table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS newsletter (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                status TEXT DEFAULT 'subscribed',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME
            )
        ''')
        
        conn.commit()
        print("Database initialized successfully with franchise support")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()

def create_user(first_name, last_name, email, company, phone, password, role="user", referral_code=None):
    try:
        # Hash the password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # If user is signing up with a referral code, validate it
        franchise_referral_code = None
        if referral_code:
            # Check if referral code exists and belongs to a franchise
            franchise = get_franchise_by_referral_code(referral_code)
            if franchise:
                franchise_referral_code = referral_code
            else:
                raise Exception("Invalid referral code")
        
        cursor.execute('''
            INSERT INTO users (first_name, last_name, email, company, phone, password_hash, role, referral_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (first_name, last_name, email, company, phone, password_hash, role, franchise_referral_code))
        
        user_id = cursor.lastrowid
        
        # If user is being created as a franchise, generate a referral code
        if role == "franchise":
            referral_code = generate_unique_referral_code()
            franchise_name = f"{first_name} {last_name}"
            create_franchise(user_id, franchise_name, referral_code)
            # Update user with franchise code
            cursor.execute('UPDATE users SET franchise_code = ? WHERE id = ?', (referral_code, user_id))
        
        conn.commit()
        conn.close()
        
        return user_id
    except sqlite3.IntegrityError:
        raise Exception("Email already exists")
    except Exception as e:
        print(f"Error creating user: {e}")
        raise Exception("Failed to create user")

def generate_unique_referral_code():
    """Generate a unique referral code"""
    conn = get_db_connection()
    while True:
        code = str(uuid.uuid4())[:8].upper()  # 8-character uppercase code
        # Check if code already exists
        existing = conn.execute('SELECT id FROM franchises WHERE referral_code = ?', (code,)).fetchone()
        if not existing:
            conn.close()
            return code

def create_franchise(user_id, franchise_name, referral_code):
    """Create a franchise entry"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO franchises (user_id, franchise_name, referral_code)
            VALUES (?, ?, ?)
        ''', (user_id, franchise_name, referral_code))
        franchise_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return franchise_id
    except Exception as e:
        print(f"Error creating franchise: {e}")
        raise Exception("Failed to create franchise")

# database.py - Fixed create_franchise_by_email function

def create_franchise_by_email(email, franchise_name=None):
    """Create a franchise by email - if user doesn't exist, create them"""
    conn = None
    try:
        conn = get_db_connection()
        
        print(f"Creating franchise for email: {email}")
        
        # Check if user exists
        user = conn.execute('SELECT id, first_name, last_name, role FROM users WHERE email = ?', (email,)).fetchone()
        
        if user:
            print(f"User found: ID={user['id']}, Email={email}, Role={user['role']}")
            
            # User exists, check if they're already a franchise
            if user['role'] == 'franchise':
                raise Exception("User is already a franchise")
                
            # Update user role to franchise
            referral_code = generate_unique_referral_code()
            print(f"Generated referral code: {referral_code}")
            
            conn.execute('UPDATE users SET role = "franchise", franchise_code = ? WHERE id = ?', 
                        (referral_code, user['id']))
            
            # Create franchise entry
            if not franchise_name:
                franchise_name = f"{user['first_name']} {user['last_name']}"
                print(f"Using default franchise name: {franchise_name}")
                
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO franchises (user_id, franchise_name, referral_code)
                VALUES (?, ?, ?)
            ''', (user['id'], franchise_name, referral_code))
            
            franchise_id = cursor.lastrowid
            print(f"Franchise created with ID: {franchise_id}")
            
            conn.commit()
            return franchise_id
            
        else:
            print(f"User not found, creating new user: {email}")
            
            # User doesn't exist, create a new user with franchise role
            if not franchise_name:
                email_prefix = email.split('@')[0]
                first_name = email_prefix
                last_name = ""
                franchise_name = f"{first_name} {last_name}"
                print(f"Using email prefix as name: {franchise_name}")
            else:
                name_parts = franchise_name.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ""
                print(f"Using provided franchise name: {franchise_name}")
            
            # Generate a temporary password
            temp_password = str(uuid.uuid4())[:12]
            password_hash = bcrypt.hashpw(temp_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            print(f"Generated temp password hash")
            
            # Create user
            cursor = conn.cursor()
            referral_code = generate_unique_referral_code()
            print(f"Generated referral code: {referral_code}")
            
            cursor.execute('''
                INSERT INTO users (first_name, last_name, email, password_hash, role, franchise_code)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (first_name, last_name, email, password_hash, "franchise", referral_code))
            
            user_id = cursor.lastrowid
            print(f"New user created with ID: {user_id}")
            
            # Create franchise entry
            cursor.execute('''
                INSERT INTO franchises (user_id, franchise_name, referral_code)
                VALUES (?, ?, ?)
            ''', (user_id, franchise_name, referral_code))
            
            franchise_id = cursor.lastrowid
            print(f"New franchise created with ID: {franchise_id}")
            
            conn.commit()
            return franchise_id
            
    except sqlite3.Error as e:
        print(f"SQLite error in create_franchise_by_email: {e}")
        if conn:
            conn.rollback()
        raise Exception(f"Database error: {str(e)}")
    except Exception as e:
        print(f"Error in create_franchise_by_email: {e}")
        if conn:
            conn.rollback()
        raise Exception(f"Failed to create franchise: {str(e)}")
    finally:
        if conn:
            conn.close()

def get_franchise_by_referral_code(referral_code):
    """Get franchise by referral code"""
    try:
        conn = get_db_connection()
        franchise = conn.execute('SELECT * FROM franchises WHERE referral_code = ?', (referral_code,)).fetchone()
        conn.close()
        return dict(franchise) if franchise else None
    except Exception as e:
        print(f"Error getting franchise by referral code: {e}")
        return None

def get_franchise_by_user_id(user_id):
    """Get franchise by user ID"""
    try:
        conn = get_db_connection()
        franchise = conn.execute('SELECT * FROM franchises WHERE user_id = ?', (user_id,)).fetchone()
        conn.close()
        return dict(franchise) if franchise else None
    except Exception as e:
        print(f"Error getting franchise by user ID: {e}")
        return None

def get_all_franchises():
    """Get all franchises with user information"""
    try:
        conn = get_db_connection()
        franchises = conn.execute('''
            SELECT f.*, u.email, u.first_name, u.last_name 
            FROM franchises f 
            LEFT JOIN users u ON f.user_id = u.id 
            ORDER BY f.id
        ''').fetchall()
        conn.close()
        return [dict(f) for f in franchises]
    except Exception as e:
        print(f"Error getting all franchises: {e}")
        return []

def delete_franchise(franchise_id):
    """Delete a franchise"""
    try:
        conn = get_db_connection()
        # First get the user_id to update the user role
        franchise = conn.execute('SELECT user_id FROM franchises WHERE id = ?', (franchise_id,)).fetchone()
        if franchise:
            user_id = franchise['user_id']
            # Update user role back to user
            conn.execute('UPDATE users SET role = "user", franchise_code = NULL WHERE id = ?', (user_id,))
        # Delete the franchise
        conn.execute('DELETE FROM franchises WHERE id = ?', (franchise_id,))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error deleting franchise: {e}")
        return False

def get_users_by_franchise(franchise_code):
    """Get all users who signed up with a specific franchise referral code"""
    try:
        conn = get_db_connection()
        users = conn.execute('''
            SELECT * FROM users 
            WHERE referral_code = ? 
            ORDER BY created_at DESC
        ''', (franchise_code,)).fetchall()
        conn.close()
        return [dict(u) for u in users]
    except Exception as e:
        print(f"Error getting users by franchise: {e}")
        return []

def authenticate_user(email, password):
    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        if not user:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8'))
    except Exception as e:
        print(f"Error authenticating user: {e}")
        return False

def get_user_by_email(email):
    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        return dict(user) if user else None
    except Exception as e:
        print(f"Error getting user by email: {e}")
        return None

def get_user_by_id(user_id):
    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        return dict(user) if user else None
    except Exception as e:
        print(f"Error getting user by ID: {e}")
        return None

def list_users():
    try:
        conn = get_db_connection()
        users = conn.execute('SELECT * FROM users ORDER BY id').fetchall()
        conn.close()
        return [dict(u) for u in users]
    except Exception as e:
        print(f"Error listing users: {e}")
        return []

def modify_user(user_id, first_name, last_name, email, company, phone):
    try:
        conn = get_db_connection()
        conn.execute('''
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, company = ?, phone = ?
            WHERE id = ?
        ''', (first_name, last_name, email, company, phone, user_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error modifying user: {e}")
        return False

def remove_user(user_id):
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error removing user: {e}")
        return False

def get_user_role(user_id):
    try:
        conn = get_db_connection()
        user = conn.execute('SELECT role FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        return user['role'] if user else None
    except Exception as e:
        print(f"Error getting user role: {e}")
        return None

def update_user_role(user_id, role):
    try:
        conn = get_db_connection()
        conn.execute('UPDATE users SET role = ? WHERE id = ?', (role, user_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error updating user role: {e}")
        return False

def reset_user_password(email, new_password):
    try:
        password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        conn = get_db_connection()
        conn.execute('UPDATE users SET password_hash = ? WHERE email = ?', (password_hash, email))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error resetting password: {e}")
        return False

def create_contact(name, email, message):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', (name, email, message))
        cid = cursor.lastrowid
        conn.commit()
        conn.close()
        return cid
    except Exception as e:
        print(f"Error creating contact: {e}")
        return None

def list_contacts_all():
    try:
        conn = get_db_connection()
        contacts = conn.execute('SELECT * FROM contacts ORDER BY id DESC').fetchall()
        conn.close()
        return [dict(c) for c in contacts]
    except Exception as e:
        print(f"Error listing contacts: {e}")
        return []

def get_contact(contact_id):
    try:
        conn = get_db_connection()
        contact = conn.execute('SELECT * FROM contacts WHERE id = ?', (contact_id,)).fetchone()
        conn.close()
        return dict(contact) if contact else None
    except Exception as e:
        print(f"Error getting contact: {e}")
        return None

def remove_contact(contact_id):
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM contacts WHERE id = ?', (contact_id,))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error removing contact: {e}")
        return False

def create_enquiry(data):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO enquiries 
            (first_name, last_name, email, phone, company, job_title, service_type, budget, timeline, message, how_did_you_hear, franchise_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('firstName', ''),
            data.get('lastName', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('company', ''),
            data.get('jobTitle', ''),
            data.get('serviceType', ''),
            data.get('budget', ''),
            data.get('timeline', ''),
            data.get('message', ''),
            data.get('howDidYouHear', ''),
            data.get('franchiseCode', '')
        ))
        eid = cursor.lastrowid
        conn.commit()
        conn.close()
        return eid
    except Exception as e:
        print(f"Error creating enquiry: {e}")
        return None

def list_enquiries_all():
    try:
        conn = get_db_connection()
        enquiries = conn.execute('SELECT * FROM enquiries ORDER BY id DESC').fetchall()
        conn.close()
        return [dict(e) for e in enquiries]
    except Exception as e:
        print(f"Error listing enquiries: {e}")
        return []

def get_enquiry(enquiry_id):
    try:
        conn = get_db_connection()
        enquiry = conn.execute('SELECT * FROM enquiries WHERE id = ?', (enquiry_id,)).fetchone()
        conn.close()
        return dict(enquiry) if enquiry else None
    except Exception as e:
        print(f"Error getting enquiry: {e}")
        return None

def remove_enquiry(enquiry_id):
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM enquiries WHERE id = ?', (enquiry_id,))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error removing enquiry: {e}")
        return False

def subscribe_email(email):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO newsletter (email, status, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
        ''', (email, 'subscribed'))
        nid = cursor.lastrowid
        conn.commit()
        conn.close()
        return nid
    except Exception as e:
        print(f"Error subscribing email: {e}")
        return None

def unsubscribe_email(email):
    try:
        conn = get_db_connection()
        conn.execute('''
            UPDATE newsletter 
            SET status = 'unsubscribed', updated_at = CURRENT_TIMESTAMP 
            WHERE email = ?
        ''', (email,))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error unsubscribing email: {e}")
        return False

def list_newsletter():
    try:
        conn = get_db_connection()
        subscribers = conn.execute('SELECT * FROM newsletter ORDER BY id DESC').fetchall()
        conn.close()
        return [dict(s) for s in subscribers]
    except Exception as e:
        print(f"Error listing newsletter: {e}")
        return []