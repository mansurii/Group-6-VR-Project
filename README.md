# **AR-VR-Group-6**

## Project Overview

This project showcases a collection of virtual reality (VR) experiences built using A-Frame. The VR scenes are based on the real-world locations at London South Bank University (LSBU). The experiences are hosted on a local server for testing and demonstration purposes.

### Key Features:
- Interactive VR scenes for different buildings of LSBU.
- Simple and user-friendly interface to navigate between scenes.
- Hosted locally using a Python server.

## 📁 **Project Directory & Folder Structure:**

### **Files:**
- **`index.html`**: Main point of the website. The landing page that links to all other VR experiences.
- **`site1.html`**: LSBU Hub. VR scene for LSBU Hub.
- **`site2.html`**: LSBU Active. VR scene for LSBU Active.
- **`site3.html`**: Keyworth Building. VR scene for the Keyworth Building.
- **`site4.html`**: Borough Road Building. VR scene for the Borough Road Building.
- **`server.py`**: Python server running on port 5000 to serve the website locally.

### **Folders:**
- **`/assets/`**: Folder for all media (images, models, audio, etc.).
- **`.gitkeep`**: Ensures the folder is tracked by Git even though it's empty for now.

#### **`/css/`**: Folder for CSS files.
- **`styles.css`**: Global styles for the entire website.
  - **`site1.css`**: Page-specific styles for `site1.html`.
  - **`site2.css`**: Page-specific styles for `site2.html`.
  - **`site3.css`**: Page-specific styles for `site3.html`.
  - **`site4.css`**: Page-specific styles for `site4.html`.

#### **`/js/`**: Folder for JavaScript files.
- **`/js/`**: Folder for JavaScript files.
    - **`.gitkeep`**: Ensures the folder is tracked by Git even though it's empty for now.

#### **`/lib/`**: External libraries (optional).
- **`/lib/`**: External libraries (optional).
    - **`aframe.min.js`**: A-Frame library stored locally.

### **Other Files:**
- **`requirements.txt`**: If using any backend or other dependencies (for Python, etc.).
- **`LICENSE.txt`**: Project License.
- **`README.md`**: Project documentation.
