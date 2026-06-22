# Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript types are properly defined
- [ ] No console.log debug statements remain
- [ ] ESLint passes with no warnings
- [ ] All imports are used (no unused imports)
- [ ] No hardcoded credentials or secrets
- [ ] Git history is clean

### Testing
- [ ] Landing page loads and renders correctly
- [ ] IDE compiles Solidity code without errors
- [ ] AI chat responds to messages
- [ ] Contract deployment works on testnet
- [ ] MetaMask wallet integration functions
- [ ] Form validation works for all inputs
- [ ] Error handling displays user-friendly messages
- [ ] Loading states show while fetching data

### Performance
- [ ] Lighthouse score is 90+ on all metrics
- [ ] Page load time < 3 seconds
- [ ] Images are optimized and lazy-loaded
- [ ] API responses are < 1 second
- [ ] No layout shifts or jank on scroll

### Accessibility
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Forms have proper labels and error messages
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

### Security
- [ ] All user inputs are validated
- [ ] HTTPS is enabled
- [ ] Environment variables are not logged
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] CSRF protection is enabled
- [ ] SQL injection protection via ORM

### Browser Support
- [ ] Works on Chrome 90+
- [ ] Works on Firefox 88+
- [ ] Works on Safari 14+
- [ ] Mobile responsive on iOS and Android

## Environment Setup

### Production Environment Variables

```env
# Required
NODE_ENV=production
DATABASE_URL=postgresql://prod-user:password@prod-db.neon.tech/prod-db
BETTER_AUTH_SECRET=<generate: openssl rand -base64 32>

# Optional but recommended
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
ANTHROPIC_API_KEY=<your-claude-api-key>

# Sentry (optional error tracking)
SENTRY_DSN=https://...
```

### Database Setup

```bash
# Create production database on Neon
# Set DATABASE_URL to production connection string

# Run migrations
npx drizzle-kit migrate

# Verify tables created
psql $DATABASE_URL -c "\dt"
```

## Vercel Deployment

### Setup

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select GitHub repository
   - Select framework: "Next.js"

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Never expose secrets in repository
   - Use Vercel Secrets Manager

3. **Build Settings**
   - Build command: `pnpm build`
   - Output directory: `.next`
   - Install command: `pnpm install`

### Deploy

```bash
# Trigger automatic deploy on git push
git push origin main

# Or manual deploy
vercel deploy --prod
```

### Post-Deploy Verification

- [ ] Site loads at yourdomain.com
- [ ] All pages are accessible
- [ ] Authentication works
- [ ] Database queries execute
- [ ] AI chat responds
- [ ] Contract deployment works

## Docker Deployment

### Build Image

```bash
docker build -t agunnaya-studio:latest .
docker tag agunnaya-studio:latest your-registry/agunnaya-studio:latest
docker push your-registry/agunnaya-studio:latest
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e BETTER_AUTH_SECRET="..." \
  -e NODE_ENV="production" \
  --name agunnaya-studio \
  your-registry/agunnaya-studio:latest
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: agunnaya-studio:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres/db
      BETTER_AUTH_SECRET: your-secret
      NODE_ENV: production
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: agunnaya
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Monitoring

### Setup Monitoring

- [ ] Enable Vercel Analytics
- [ ] Setup error tracking (Sentry)
- [ ] Configure database monitoring
- [ ] Setup uptime monitoring
- [ ] Configure alerting

### Health Checks

```bash
# Check application health
curl https://yourdomain.com/api/health

# Check database connection
psql $DATABASE_URL -c "SELECT NOW();"

# View logs
vercel logs
```

### Metrics to Monitor

- Page load time
- API response time
- Error rate
- Database query performance
- User session count
- Deployment frequency

## Rollback Plan

### If Deployment Fails

1. Check Vercel deployment logs
2. Verify environment variables are set
3. Check database migrations completed
4. Review recent code changes
5. Rollback to previous commit: `git revert <commit>`

```bash
# Redeploy previous version
vercel deploy --prod
```

## Post-Deployment

### Day 1
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test core functionality
- [ ] Verify database backups

### Day 7
- [ ] Review user feedback
- [ ] Check analytics data
- [ ] Performance optimization review
- [ ] Security audit

### Month 1
- [ ] User adoption metrics
- [ ] Feature usage analysis
- [ ] Performance optimization
- [ ] Quarterly planning

## Maintenance

### Regular Tasks

- **Daily**: Check error logs
- **Weekly**: Review performance metrics
- **Monthly**: Database maintenance
- **Quarterly**: Security audit

### Update Schedule

```bash
# Check for outdated packages
pnpm outdated

# Update dependencies
pnpm update

# Major version updates (manual)
pnpm add package@latest
```

### Backup Strategy

- Automated database backups daily
- Retention: 30 days
- Test restore monthly
- Store backups in separate region

## Security Checklist

- [ ] SSL/TLS certificate valid
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] DDoS protection active
- [ ] Database encrypted at rest
- [ ] Backups encrypted
- [ ] Access logs enabled
- [ ] Audit logs enabled

## Compliance

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliant (if applicable)
- [ ] Data retention policies defined
- [ ] User data export available

## Support

### Runbooks

Create runbooks for common issues:
- Database connection failures
- High CPU/memory usage
- API timeout errors
- Wallet connection issues

### Escalation

- L1: Automated alerts
- L2: On-call engineer
- L3: Engineering team lead
- Critical: VP Engineering

---

Last updated: 2026-06-22
Review frequency: Quarterly
