import fitz  # PyMuPDF
import os

certs_dir = r"e:\Zen\projects\portfolio\Portfolio\certs"
output_dir = r"e:\Zen\projects\portfolio\Portfolio\images\cert-previews"
os.makedirs(output_dir, exist_ok=True)

converted = 0
for filename in os.listdir(certs_dir):
    if not filename.lower().endswith('.pdf'):
        continue
    
    pdf_path = os.path.join(certs_dir, filename)
    img_name = filename.replace('.pdf', '.jpg')
    img_path = os.path.join(output_dir, img_name)
    
    try:
        doc = fitz.open(pdf_path)
        page = doc[0]  # First page
        # Render at 2x zoom for good quality
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        pix.save(img_path)
        doc.close()
        converted += 1
        print(f"  OK: {filename} -> {img_name} ({pix.width}x{pix.height})")
    except Exception as e:
        print(f"  FAIL: {filename} -> {e}")

print(f"\nConverted {converted} PDFs to images in {output_dir}")
