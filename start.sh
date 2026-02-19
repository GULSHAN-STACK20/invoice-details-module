#!/bin/bash

echo "🚀 Starting Fixwala MERN Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Function to check if MongoDB is running
check_mongodb() {
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  Warning: MongoDB doesn't appear to be running locally."
        echo "   Make sure you have MongoDB installed and running, or use MongoDB Atlas."
        echo "   See README.md for more information."
        echo ""
    fi
}

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Check MongoDB
check_mongodb

# Check if .env exists in server directory
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env file not found."
    echo "   Copying from server/.env.example..."
    cp server/.env.example server/.env
    echo "   Please update server/.env with your MongoDB connection string."
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "Starting servers..."
echo "📡 Backend will run on: http://localhost:5000"
echo "🌐 Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers
cd server && npm start &
SERVER_PID=$!

cd client && npm start &
CLIENT_PID=$!

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
