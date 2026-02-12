# ✅ Deployment Checklist

Gunakan checklist ini untuk memastikan deployment berjalan lancar.

## 📋 Pre-Deployment

### Server Setup
- [ ] VPS dengan Ubuntu 20.04+ ready
- [ ] Minimal 2GB RAM
- [ ] Minimal 20GB disk space
- [ ] Root/sudo access tersedia
- [ ] Domain sudah pointing ke VPS IP (optional)

### Software Installation
- [ ] Docker installed (`docker --version`)
- [ ] Docker Compose installed (`docker-compose --version`)
- [ ] Nginx installed (`nginx -v`)
- [ ] Certbot installed (jika pakai SSL)
- [ ] Git installed (`git --version`)

### Repository
- [ ] Code sudah di-push ke repository
- [ ] Semua file konfigurasi ada (.env.example, Dockerfile, dll)
- [ ] Scripts sudah executable

## 🚀 Deployment Steps

### 1. Clone & Setup
- [ ] Clone repository ke `/var/www/iwareid`
- [ ] Run `./setup-permissions.sh`
- [ ] Copy `.env.example` ke `.env`
- [ ] Edit `.env` dengan nilai production

### 2. Environment Configuration
- [ ] `MYSQL_ROOT_PASSWORD` - password kuat
- [ ] `MYSQL_PASSWORD` - password kuat
- [ ] `JWT_SECRET` - generate baru (32+ karakter)
- [ ] `REACT_APP_API_URL` - URL domain production
- [ ] `FRONTEND_URL` - URL domain production

### 3. Run Deployment
- [ ] Run `sudo ./deploy-vps.sh`
- [ ] Wait for completion (5-10 minutes)
- [ ] Check for errors in output

### 4. Verify Containers
- [ ] MySQL container running & healthy
- [ ] Backend container running & healthy
- [ ] Frontend container running & healthy
- [ ] Run `./docker-status.sh` untuk verify

### 5. Test Endpoints
- [ ] `curl http://localhost:5000/api/health` returns OK
- [ ] `curl http://localhost:3000` returns HTML
- [ ] Login page accessible

### 6. Nginx Setup (if using domain)
- [ ] Copy `nginx-vps.conf` to `/etc/nginx/sites-available/`
- [ ] Create symlink to `sites-enabled`
- [ ] Remove default config
- [ ] Test config: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`
- [ ] Test domain access

### 7. SSL Setup (if using domain)
- [ ] Run certbot: `sudo certbot --nginx -d domain.com -d www.domain.com`
- [ ] Select redirect HTTP to HTTPS
- [ ] Test SSL: `https://domain.com`
- [ ] Verify auto-renewal: `sudo certbot renew --dry-run`

### 8. Firewall Configuration
- [ ] Allow SSH: `sudo ufw allow 22/tcp`
- [ ] Allow HTTP: `sudo ufw allow 80/tcp`
- [ ] Allow HTTPS: `sudo ufw allow 443/tcp`
- [ ] Enable firewall: `sudo ufw enable`
- [ ] Check status: `sudo ufw status`

## 🔐 Post-Deployment Security

### Change Default Credentials
- [ ] Login as admin (admin/admin123)
- [ ] Change admin password
- [ ] Login as HRD (hrd/hrd123)
- [ ] Change HRD password

### Database Security
- [ ] MySQL only accessible from localhost
- [ ] Strong root password set
- [ ] Strong user password set

### Application Security
- [ ] JWT_SECRET is unique and strong
- [ ] CORS configured correctly
- [ ] File upload limits set
- [ ] Error messages don't expose sensitive info

## 📊 Monitoring Setup

### Health Checks
- [ ] Backend health endpoint working
- [ ] Frontend health endpoint working
- [ ] Database connection stable

### Logging
- [ ] Application logs accessible
- [ ] Error logs being written
- [ ] Log rotation configured

### Backups
- [ ] Database backup script ready
- [ ] Uploads backup script ready
- [ ] Backup schedule configured
- [ ] Test restore procedure

## 🧪 Testing

### Functional Testing
- [ ] Login works (admin & HRD)
- [ ] Karyawan list loads
- [ ] Pengajuan form works
- [ ] File upload works
- [ ] Approval/rejection works
- [ ] Dashboard displays correctly

### Performance Testing
- [ ] Page load times acceptable
- [ ] API response times good
- [ ] No memory leaks
- [ ] Resource usage normal

### Browser Testing
- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works (if applicable)
- [ ] Mobile responsive

## 📝 Documentation

- [ ] Update README with production URL
- [ ] Document any custom configurations
- [ ] Save credentials securely
- [ ] Share access with team
- [ ] Document backup procedures

## 🔄 Maintenance Plan

- [ ] Schedule regular updates
- [ ] Monitor disk space
- [ ] Monitor resource usage
- [ ] Review logs regularly
- [ ] Test backups monthly
- [ ] Update SSL certificates (auto-renewal)

## 🆘 Emergency Contacts

- [ ] VPS provider support
- [ ] Domain registrar support
- [ ] Development team contacts
- [ ] Backup admin access

## ✅ Final Verification

- [ ] All containers running
- [ ] All health checks passing
- [ ] Application accessible
- [ ] SSL working (if configured)
- [ ] Backups configured
- [ ] Monitoring in place
- [ ] Documentation complete
- [ ] Team notified

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Production URL:** _____________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
