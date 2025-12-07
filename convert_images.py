import os
from PIL import Image
from pathlib import Path

def convert_images_to_webp(directory):
    # Walk through directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = Path(root) / file
                webp_path = file_path.with_suffix('.webp')
                
                print(f"Converting {file} to {webp_path.name}...")
                
                try:
                    with Image.open(file_path) as img:
                        # Save as WebP
                        img.save(webp_path, 'WEBP', quality=85)
                        print(f"Success: {webp_path}")
                except Exception as e:
                    print(f"Error converting {file}: {e}")

if __name__ == "__main__":
    target_dir = os.path.join(os.getcwd(), 'public')
    print(f"Scanning {target_dir}...")
    convert_images_to_webp(target_dir)
