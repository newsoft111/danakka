from passlib.context import CryptContext

class Hasher:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def get_password_hash(cls, password: str) -> str:
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, password: str, hashed_password: str) -> bool:
        return cls.pwd_context.verify(password, hashed_password)