from pydantic import BaseModel, EmailStr, field_validator, SecretStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    password: SecretStr
    role: Optional[str] = "user"
    referral_code: Optional[str] = None

    @field_validator('password')
    def password_length(cls, v):
        if len(v.get_secret_value()) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: SecretStr
    referral_code: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    role: str
    franchise_code: Optional[str] = None
    referral_code: Optional[str] = None
    created_at: datetime

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    phone: Optional[str] = None

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    created_at: datetime

class EnquiryCreate(BaseModel):
    firstName: str
    lastName: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    jobTitle: Optional[str] = None
    serviceType: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    message: str
    howDidYouHear: Optional[str] = None
    franchiseCode: Optional[str] = None

class EnquiryResponse(BaseModel):
    id: int
    firstName: str
    lastName: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    jobTitle: Optional[str] = None
    serviceType: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    message: str
    howDidYouHear: Optional[str] = None
    created_at: datetime

class NewsletterSubscribe(BaseModel):
    email: EmailStr

class NewsletterResponse(BaseModel):
    id: int
    email: EmailStr
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class FranchiseCreate(BaseModel):
    email: EmailStr
    franchise_name: Optional[str] = None

class FranchiseResponse(BaseModel):
    id: int
    user_id: int
    franchise_name: str
    referral_code: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime