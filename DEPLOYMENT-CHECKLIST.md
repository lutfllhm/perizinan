# ✅ Deployment Checklist - IWARE Perizinan

Gunakan checklist ini untuk memastikan semua langkah deployment sudah dilakukan dengan benar.

## Pre-Deployment

### VPS Setup
- [ ] VPS sudah siap (minimal 2GB RAM, 20GB storage)
- [ ] OS: Ubuntu 20.04/22.04 LTS
- [ ] Akses SSH tersedia
- [ ] IP address VPS sudah dicatat

### Domain Setup
- [ ] Domain sudah dibeli
- [ ] DNS A record untuk @ pointing ke IP VPS
- [ ] DNS A record untuk www pointing ke IP VPS
- [ ] DNS sudah propagate (test dengan `ping domain.com`)

### Repository
- [ ] Code sudah di-push ke Git repository
- [ ] Repository bisa diakses dari VPS
- [ ] Branch production sudah siap

## Installation

### System Dependencies
- [ ] System sudah di-update (`apt update && apt upgrade`)
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Nginx installed
- [ ] Certbot installed
- [ ] Git installed
- [ ] Firewall (ufw) configured
  - [ ] Port 22 (SSH) allowed
  - [ ] Port 80 (HTTP) allowed
  - [ ] Port 443 (HTTPS) allowed

### Application Setup
- [ ] Repository cloned ke `/var/www/iware`
- [ ] File `.env` sudah dibuat dari `.env.docker`
- [ ] Environment variables sudah diupdate:
  - [ ] MYSQL_PASSWORD diganti
  - [ ] JWT_SECRET di-generate dan diisi
  - [ ] REACT_APP_API_URL sesuai domain
  - [ ] FRONTEND_URL sesuai domain
- [ ] File permissions sudah benar

## Docker Setup

### Build & Run
- [ ] Docker images berhasil di-build
- [ ] Container MySQL running dan healthy
- [ ] Container Backend running dan healthy
- [ ] Container Frontend running dan healthy
- [ ] Semua container bisa restart otomatis

### Verification
- [ ] `docker-compose ps` menunjukkan semua service UP
- [ ] Backend health check OK (`curl http://localhost:5000/api/health`)
- [ ] Frontend accessible (`curl http://localhost:3000`)
- [ ] MySQL bisa diakses

## Nginx & SSL

### Nginx Configuration
- [ ] nginx-vps.conf copied ke `/etc/nginx/sites-available/`
- [ ] Symbolic link created di `/etc/nginx/sites-enabled/`
- [ ] Default site disabled
- [ ] Nginx config test passed (`nginx -t`)
- [ ] Nginx restarted successfully

### SSL Certificate
- [ ] Certbot berhasil generate certificate
- [ ] Certificate untuk domain utama (domain.com)
- [ ] Certificate untuk www subdomain (www.domain.com)
- [ ] Auto-renewal configured
- [ ] HTTPS redirect working
- [ ] SSL test passed (https://www.ssllabs.com/ssltest/)

## Database

### Initialization
- [ ] Database `iware_perizinan` created
- [ ] Tables created successfully
- [ ] Admin user created
- [ ] Default password: admin123
- [ ] Database bisa diakses dari backend

### Data Import (Optional)
- [ ] Karyawan data imported (jika ada)
- [ ] Data verification completed

## Testing

### Backend Testing
- [ ] Health endpoint working (`/api/health`)
- [ ] Login endpoint working (`/api/auth/login`)
- [ ] CORS configured correctly
- [ ] File upload working
- [ ] API response time acceptable

### Frontend Testing
- [ ] Homepage loading correctly
- [ ] Login page accessible
- [ ] Login functionality working
- [ ] Dashboard loading after login
- [ ] Navigation working
- [ ] Forms working
- [ ] File upload working
- [ ] Responsive design working (mobile/tablet/desktop)

### Integration Testing
- [ ] Frontend bisa connect ke backend
- [ ] Authentication flow working
- [ ] Data fetching working
- [ ] Form submission working
- [ ] File upload & download working

## Security

### Application Security
- [ ] Default admin password CHANGED
- [ ] Strong database password used
- [ ] JWT secret is random and secure
- [ ] Environment variables tidak di-commit ke git
- [ ] .env file permissions correct (600)

### Server Security
- [ ] Firewall enabled dan configured
- [ ] SSH key authentication (recommended)
- [ ] Root login disabled (recommended)
- [ ] Fail2ban installed (recommended)
- [ ] Regular security updates scheduled

### SSL/TLS
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate valid
- [ ] TLS 1.2+ only
- [ ] Security headers configured
- [ ] HSTS enabled

## Monitoring & Backup

### Monitoring
- [ ] Container health checks working
- [ ] Log rotation configured
- [ ] Disk space monitoring
- [ ] Memory usage monitoring
- [ ] CPU usage monitoring

### Backup
- [ ] Database backup script created
- [ ] Automated backup scheduled (cron)
- [ ] Backup location configured
- [ ] Backup restoration tested
- [ ] Backup retention policy defined

### Logging
- [ ] Application logs accessible
- [ ] Nginx access logs working
- [ ] Nginx error logs working
- [ ] Docker logs accessible
- [ ] Log files not filling disk

## Documentation

### Internal Documentation
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Database schema documented

### Team Access
- [ ] SSH access provided to team
- [ ] Git repository access configured
- [ ] Admin credentials shared securely
- [ ] Emergency contacts documented

## Post-Deployment

### Verification
- [ ] Application accessible from internet
- [ ] All features working as expected
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Mobile responsiveness verified

### User Acceptance
- [ ] Stakeholders notified
- [ ] User testing completed
- [ ] Feedback collected
- [ ] Issues documented

### Maintenance Plan
- [ ] Update procedure documented
- [ ] Backup procedure documented
- [ ] Rollback procedure documented
- [ ] Monitoring alerts configured
- [ ] Support contact established

## Final Checks

- [ ] All checklist items completed
- [ ] No critical errors in logs
- [ ] Performance metrics acceptable
- [ ] Security scan passed
- [ ] Documentation up to date
- [ ] Team trained on maintenance procedures

---

## Sign-off

**Deployed by**: ___________________  
**Date**: ___________________  
**Version**: ___________________  
**Environment**: Production  

**Verified by**: ___________________  
**Date**: ___________________  

---

## Notes

_Add any additional notes or issues encountered during deployment:_

```
[Your notes here]
```

---

## Quick Reference

### Important URLs
- Application: https://yourdomain.com
- API Health: https://yourdomain.com/api/health

### Important Commands
```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Backup database
bash quick-commands.sh backup

# Update application
bash quick-commands.sh update
```

### Important Files
- Environment: `/var/www/iware/.env`
- Nginx Config: `/etc/nginx/sites-available/iwareid.com`
- SSL Certs: `/etc/letsencrypt/live/yourdomain.com/`
- Logs: `/var/log/nginx/` and `docker-compose logs`

### Support Contacts
- Developer: [contact]
- DevOps: [contact]
- Emergency: [contact]
