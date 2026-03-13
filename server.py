import http.server
import socketserver

# The port where the server will run
PORT = 5000

# Set up the handler to serve the files
Handler = http.server.SimpleHTTPRequestHandler

# Start the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server is running at http://localhost:{PORT}")
    httpd.serve_forever()  # Keep the server running