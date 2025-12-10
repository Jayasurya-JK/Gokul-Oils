import os
from PIL import Image

# Define directory and files
icon_dir = r"c:\Website Projects\Gokul Oils\public\icons"
files_to_convert = [
    "Natural.png",
    "fssai.png",
    "made in india.png",
    "wood pressed.png"
]

def convert_and_delete():
    print(f"Checking directory: {icon_dir}")
    
    for filename in files_to_convert:
        file_path = os.path.join(icon_dir, filename)
        
        if not os.path.exists(file_path):
            print(f"Skipping (not found): {filename}")
            continue
            
        try:
            # Open image
            with Image.open(file_path) as img:
                # Construct new filename
                new_filename = os.path.splitext(filename)[0] + ".webp"
                new_file_path = os.path.join(icon_dir, new_filename)
                
                # Save as WebP
                img.save(new_file_path, "WEBP")
                print(f"Converted: {filename} -> {new_filename}")
                
            # Delete original if conversion was successful (file exists)
            if os.path.exists(new_file_path):
                os.remove(file_path)
                print(f"Deleted original: {filename}")
            else:
                print(f"Error: WebP file was not created for {filename}")
                
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

if __name__ == "__main__":
    convert_and_delete()
