import { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  SxProps,
  Typography,
  CircularProgress
} from '@mui/material';

/**
 * Constants
 */
export const ALLOWED_FILE_FORMATS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

/**
 * Types/Interfaces
 */
interface Props {
  label: string;
  file: File | string | null;
  fieldLabel?: string;
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  helperText?: string;
  formControlStyle?: SxProps;
  onFileChange: (file: File) => void;
  loading?: boolean;
}

// ----------------------------------------------------------------------

/**
 * Styles
 */
const styles = {
  uploadFileBoxStyle: {
    display: 'flex',
    alignItems: 'center',
    my: 1
  },
  formLabelStyle: {
    display: 'block',
    mb: 1
  },
  previewContainer: {
    width: 200,
    mt: 2,
    position: 'relative'
  },
  filePreview: {
    borderRadius: 1,
    objectFit: 'cover',
    width: '100%',
    height: 'auto',
    p: 2,
    border: '1px solid',
    borderColor: 'divider'
  }
};

/**
 * @return {JSX.Element}
 */
const UploadSingleFile: React.FC<Props> = ({
  label,
  file,
  fieldLabel,
  size = 'medium',
  error,
  helperText,
  formControlStyle,
  onFileChange,
  loading = false
}): JSX.Element => {
  /* Constants */
  const FILE_SIZE = 1000000; // 1MB in bytes

  /* States */
  const [fileError, setFileError] = useState<string>();
  const [preview, setPreview] = useState<string | null>(null);

  /**
   * Functions
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      const checkSize = uploadedFile.size < FILE_SIZE;
      const checkType = ALLOWED_FILE_FORMATS.includes(uploadedFile.type);

      if (!checkSize) {
        setFileError('size-invalid');
      } else if (!checkType) {
        setFileError('type-invalid');
      } else {
        setFileError('');
        onFileChange(uploadedFile);

        // Generate preview for image files
        if (uploadedFile.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(uploadedFile));
        } else {
          setPreview(null);
        }
      }
    }
  };

  const getFileIcon = (fileType: string): string => {
    switch (fileType) {
      case 'application/pdf':
        return '📄'; // Replace with actual icons if needed
      default:
        return '📎';
    }
  };

  return (
    <FormControl
      variant="standard"
      error={error}
      sx={{ display: 'flex', ...formControlStyle }}
    >
      <Box sx={styles.uploadFileBoxStyle}>
        <Box sx={{ mx: 0, px: 0 }}>
          {fieldLabel && (
            <FormLabel sx={styles.formLabelStyle}>{fieldLabel}</FormLabel>
          )}
          <Button
            variant="contained"
            component="label"
            size={size}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Uploading...' : label}
            <input
              type="file"
              accept={ALLOWED_FILE_FORMATS.join(',')}
              onChange={handleFileChange}
              hidden
            />
          </Button>
        </Box>
      </Box>

      {!error && helperText && (
        <FormHelperText error sx={{ ml: fieldLabel ? 21 : 1 }}>
          {helperText}
        </FormHelperText>
      )}

      {fileError === 'size-invalid' && (
        <FormHelperText error>File size must be less than 1MB</FormHelperText>
      )}
      {fileError === 'type-invalid' && (
        <FormHelperText error>
          File type must be PDF, JPEG, JPG, or PNG
        </FormHelperText>
      )}

      {file && (
        <Box sx={styles.previewContainer}>
          {preview ? (
            <Box
              component="img"
              src={preview}
              alt="file preview"
              sx={styles.filePreview}
            />
          ) : (
            <></>
            // <Typography>
            //   {getFileIcon((file as File).type)} {file.name}
            // </Typography>
          )}
        </Box>
      )}
    </FormControl>
  );
};

export default UploadSingleFile;
