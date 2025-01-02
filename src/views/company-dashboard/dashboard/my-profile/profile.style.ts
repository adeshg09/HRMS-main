// profile.style.ts

const styles = {
  // Profile Container
  profileContainer: (theme: any) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  }),

  // Profile Header Card
  headerCard: (theme: any) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    borderRadius: '16px',
    padding: theme.spacing(4),
    color: 'white',
    marginBottom: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '300px',
      height: '300px',
      background:
        'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
      transform: 'translate(30%, -30%)'
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3)
    }
  }),

  // Profile Info Section
  profileInfo: (theme: any) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      textAlign: 'center'
    }
  }),

  // Avatar styles
  avatar: (theme: any) => ({
    width: 120,
    height: 120,
    border: '4px solid rgba(255,255,255,0.2)',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    [theme.breakpoints.down('sm')]: {
      width: 100,
      height: 100
    }
  }),

  // Content Card
  contentCard: (theme: any) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    padding: theme.spacing(3),
    background: theme.palette.background.paper
  }),

  // Form Fields
  formField: (theme: any) => ({
    '& .MuiInputBase-root': {
      borderRadius: '12px',
      backgroundColor:
        theme.palette.mode === 'light' ? '#F8FAFC' : theme.palette.grey[900]
    },
    '& .MuiInputBase-input': {
      padding: '16px',
      '&:disabled': {
        color: theme.palette.text.primary,
        '-webkit-text-fill-color': theme.palette.text.primary
      }
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent'
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main
      }
    }
  }),

  // Action Buttons
  actionButton: (theme: any) => ({
    borderRadius: '12px',
    padding: '8px 24px',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none'
    }
  }),

  // Edit Profile Button
  editProfile: (theme: any) => ({
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      top: theme.spacing(3),
      right: theme.spacing(3)
    }
  }),

  // Stats Container
  statsContainer: (theme: any) => ({
    display: 'flex',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(1)
    }
  }),

  // Stat Item
  statItem: (theme: any) => ({
    background: 'rgba(255,255,255,0.1)',
    padding: theme.spacing(1, 2),
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  })
};

export default styles;
