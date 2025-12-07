import os
from PIL import Image
from pathlib import Path

def convert_catalogue_to_webp(source_dir, output_dir):
    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output directory: {output_dir}")

    # Walk through source directory
    count = 0
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                source_path = Path(root) / file
                # Create corresponding output path
                # We'll put all files in the output_dir flatly, or preserve structure?
                # User said "create a sepearte folder", flat is usually safer for catalogues unless nested.
                # Let's keep it simple: Save to output_dir with .webp extension
                
                output_filename = source_path.with_suffix('.webp').name
                output_path = Path(output_dir) / output_filename
                
                print(f"Converting {file}...")
                
                try:
                    with Image.open(source_path) as img:
                        # Save as WebP
                        img.save(output_path, 'WEBP', quality=90, method=6)
                        print(f"  -> Saved to {output_path.name}")
                        count += 1
                except Exception as e:
                    print(f"  -> Error converting {file}: {e}")
    
    print(f"\nCompleted! Converted {count} images.")

if __name__ == "__main__":
    base_dir = os.getcwd()
    source_folder = os.path.join(base_dir, "public", "icons", "Gokul Oils - product catalogue")
    output_folder = os.path.join(base_dir, "public", "icons", "catalogue_webp")
    
    print(f"Source: {source_folder}")
    print(f"Target: {output_folder}")
    convert_catalogue_to_webp(source_folder, output_folder)
