# OVK Wool Market Report Platform - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Security Configuration](#security-configuration)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Recent Updates](#recent-updates)

## Prerequisites

### System Requirements
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: For version control
- **Web Server**: Nginx, Apache, or similar (for production)
- **SSL Certificate**: For HTTPS (production)

### Development Tools
- **Code Editor**: VS Code, WebStorm, or similar
- **Browser**: Chrome, Firefox, Safari, or Edge
- **Terminal**: Command line interface

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd wool-market-report
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Environment Configuration
Create environment files:

**Frontend (.env.local)**
```env
# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=OVK Wool Market Report
VITE_APP_VERSION=1.0.0
```

**Backend (server/.env)**
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
JWT_SECRET=your-jwt-secret-key
```

### 5. Start Development Servers

**Terminal 1 - Backend Server**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend Server**
```bash
npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## Production Deployment

### Option 1: Traditional Server Deployment

#### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Application Deployment
```bash
# Clone repository
git clone <repository-url>
cd wool-market-report

# Install dependencies
npm install
cd server && npm install && cd ..

# Build frontend
npm run build

# Set up environment
cp .env.example .env.production
# Edit .env.production with production values
```

#### 3. Backend Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'wool-market-api',
    script: 'server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4. Nginx Configuration
```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/wool-market << EOF
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/wool-market-report/dist;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/wool-market /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL Configuration (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Option 2: Cloud Platform Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel --prod

# Deploy backend (separate project)
cd server
vercel --prod
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### AWS Deployment
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Deploy to S3 + CloudFront
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### 2. Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:3001/api

  backend:
    build: ./server
    ports:
      - "3001:3001"
    volumes:
      - ./server/database.json:/app/database.json
    environment:
      - NODE_ENV=production
      - PORT=3001
      - CORS_ORIGIN=http://localhost

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

### 3. Deploy with Docker
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Configuration

### AI Configuration
The platform includes Google Gemini AI integration for intelligent market insights generation:

#### Getting a Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for use in your environment variables

#### Environment Variables
- **VITE_GEMINI_API_KEY**: Your Google Gemini API key for AI-powered market insights
- **Fallback Mode**: The platform works without an API key using local enhancement algorithms
- **Security**: Never commit API keys to version control

### Production Environment Variables

**Frontend (.env.production)**
```env
# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_production_gemini_api_key

# Application Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=OVK Wool Market Report
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

**Backend (server/.env.production)**
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
JWT_SECRET=your-super-secure-jwt-secret
DB_PATH=/app/data/database.json
LOG_LEVEL=info
BACKUP_SCHEDULE=0 2 * * *
```

### Security Configuration
```env
# Security settings
HELMET_ENABLED=true
CORS_CREDENTIALS=true
RATE_LIMIT_ENABLED=true
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
```

## Database Setup

### JSON Database (Default)
```bash
# Create data directory
mkdir -p /app/data

# Initialize database
cp server/database.json /app/data/
chmod 644 /app/data/database.json
```

### PostgreSQL (Optional)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create database
sudo -u postgres createdb wool_market

# Create user
sudo -u postgres createuser wool_user

# Set password
sudo -u postgres psql -c "ALTER USER wool_user PASSWORD 'secure_password';"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE wool_market TO wool_user;"
```

## Security Configuration

### 1. Firewall Setup
```bash
# Configure UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. SSL/TLS Configuration
```nginx
# Nginx SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

### 3. Security Headers
```javascript
// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Monitoring & Maintenance

### 1. Log Management
```bash
# Set up log rotation
sudo cat > /etc/logrotate.d/wool-market << EOF
/var/log/wool-market/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
EOF
```

### 2. Backup Strategy
```bash
# Create backup script
cat > backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/wool-market"
mkdir -p $BACKUP_DIR

# Backup database
cp /app/data/database.json $BACKUP_DIR/database_$DATE.json

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /app

# Keep only last 30 days
find $BACKUP_DIR -name "*.json" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### 3. Health Monitoring
```bash
# Create health check script
cat > health-check.sh << EOF
#!/bin/bash
# Check if services are running
if ! pgrep -f "node.*server.js" > /dev/null; then
    echo "Backend service is down"
    # Restart service
    pm2 restart wool-market-api
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is high: $DISK_USAGE%"
fi
EOF

chmod +x health-check.sh

# Schedule health checks
crontab -e
# Add: */5 * * * * /path/to/health-check.sh
```

## Troubleshooting

### Common Issues

#### 1. Service Won't Start
```bash
# Check logs
pm2 logs wool-market-api
journalctl -u nginx -f

# Check port availability
netstat -tlnp | grep :3001
netstat -tlnp | grep :80
```

#### 2. Database Issues
```bash
# Check database file permissions
ls -la /app/data/database.json

# Verify database integrity
node -e "console.log(JSON.parse(require('fs').readFileSync('/app/data/database.json', 'utf8')))"
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run
```

#### 4. Performance Issues
```bash
# Check system resources
htop
df -h
free -h

# Check application performance
pm2 monit
```

### Recovery Procedures

#### 1. Database Recovery
```bash
# Restore from backup
cp /backups/wool-market/database_20250115_020000.json /app/data/database.json
pm2 restart wool-market-api
```

#### 2. Application Recovery
```bash
# Redeploy application
git pull origin main
npm run build
pm2 restart wool-market-api
sudo systemctl reload nginx
```

#### 3. Complete System Recovery
```bash
# Full system restore
cd /backups/wool-market
tar -xzf app_20250115_020000.tar.gz
pm2 restart all
sudo systemctl restart nginx
```

## Performance Optimization

### 1. Frontend Optimization
```bash
# Enable gzip compression
# Add to nginx.conf:
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. Backend Optimization
```javascript
// Enable clustering
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start server
}
```

### 3. Caching Strategy
```nginx
# Add caching headers
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Recent Updates

### Enhanced Form Interface (Latest)
- **95% Width Utilization**: The auction data capture form now uses 95% of the available page width for improved usability
- **Deployment Compatibility**: Enhanced form layout is fully compatible with all deployment methods
- **Mobile Responsiveness**: Form maintains full mobile compatibility across all deployment environments
- **Performance Optimization**: Wider form layout provides better user experience without impacting deployment performance

### Technical Implementation
- **Container Updates**: Form containers changed from `max-w-7xl mx-auto` to `w-[95%] mx-auto`
- **CSS Classes**: Uses Tailwind CSS `w-[95%]` class for precise width control
- **Responsive Design**: Maintains responsiveness across all screen sizes and deployment environments
- **Backward Compatibility**: All existing deployment configurations remain unchanged

## Conclusion

This deployment guide provides comprehensive instructions for deploying the OVK Wool Market Report Platform in various environments. The enhanced form interface with 95% width utilization improves user experience across all deployment scenarios. Choose the deployment method that best fits your infrastructure and requirements.

For additional support or questions, please contact the development team or refer to the technical documentation.
