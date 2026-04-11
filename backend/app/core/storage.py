import uuid
from .config import settings

class StorageService:
    def __init__(self):
        self.bucket_name = settings.GCS_BUCKET_NAME
        
    async def upload_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        # Stub returning a dummy URL for now
        # integrate with google-cloud-storage here
        return f"https://storage.googleapis.com/{self.bucket_name}/{uuid.uuid4()}-{filename}"

storage_service = StorageService()
