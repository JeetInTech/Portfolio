from flask import Flask, send_from_directory, render_template
import os

app = Flask(__name__)

# Configuration
app.config['PDF_FOLDER'] = os.path.abspath('images')  # Ensure absolute path

# Route for homepage
@app.route('/')
def index():
    return render_template('main.html')

# Route for PDF download
@app.route('/jeet')
def download_pdf():
    filename = 'Jeet_CV.pdf'  # Ensure no spaces in filename
    file_path = os.path.join(app.config['PDF_FOLDER'], filename)

    # Debugging
    print("Looking for file at:", file_path)

    if os.path.exists(file_path):
        return send_from_directory(
            directory=app.config['PDF_FOLDER'],
            path=filename,
            as_attachment=True
        )
    else:
        return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True)
