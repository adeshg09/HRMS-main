import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Box,
  styled,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { CustomField } from 'components/InputFields';
import { DocumentModel } from 'models/company/DocumentType';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  updateEmployeeDocument,
  getEmployeeDocumentDetailsByUserIdRequest
} from 'services/company/employee/documentUpload';
import { getDocumentType } from 'services/company/documentType';
import SessionContext from 'context/SessionContext';
import { AdminDashboardPage } from 'components/Page';
import Loader from 'components/Loader';

const UploadCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: `1px dashed ${theme.palette.divider}`,
  background: 'transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}));

const PreviewContainer = styled(Box)({
  position: 'relative',
  width: '100%'
});

const UploadArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  cursor: 'pointer',
  minHeight: 200,
  justifyContent: 'center',
  gap: theme.spacing(1)
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const DocumentPreview = styled(Box)({
  width: '100%',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  '& iframe': {
    width: '100%',
    height: '100%',
    border: 'none'
  }
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1
});

interface DocumentState {
  file: File | null;
  preview: boolean;
  saved: boolean;
  url: string | null;
  loading: boolean;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

const MyDocumentDetails = (): JSX.Element => {
  const [documentStates, setDocumentStates] = useState<{
    [key: number]: DocumentState;
  }>({});
  const [documentTypes, setDocumentTypes] = useState<DocumentModel[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { showSnackbar } = useSnackbarClose();
  const { user } = useContext(SessionContext);
  const [userId] = useState(user?.id);

  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      showSnackbar('File size should not exceed 1MB', 'error');
      return false;
    }
    return true;
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentTypeId: number
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      if (validateFileSize(file)) {
        setDocumentStates((prev) => ({
          ...prev,
          [documentTypeId]: {
            ...prev[documentTypeId],
            file,
            preview: true,
            saved: false
          }
        }));
      }
    }
  };

  const handleClearDocument = (documentTypeId: number): void => {
    setDocumentStates((prev) => ({
      ...prev,
      [documentTypeId]: {
        file: null,
        preview: false,
        saved: false,
        url: null,
        loading: false
      }
    }));
  };

  const renderDocumentPreview = (
    documentState: DocumentState
  ): React.ReactNode => {
    if (documentState.loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (documentState.file) {
      if (documentState.file.type.startsWith('image/')) {
        return (
          <img
            src={URL.createObjectURL(documentState.file)}
            alt="Document preview"
          />
        );
      }
      if (documentState.file.type === 'application/pdf') {
        return (
          <iframe
            src={URL.createObjectURL(documentState.file)}
            title="PDF preview"
          />
        );
      }
    }

    if (documentState.url) {
      const fullUrl = `https://hrmsapi.techechelons.net${documentState.url}`;
      if (documentState.url.match(/\.(jpeg|jpg|gif|png)$/i)) {
        return <img src={fullUrl} alt="Document preview" />;
      }
      if (documentState.url.match(/\.pdf$/i)) {
        return <iframe src={fullUrl} title="PDF preview" />;
      }
    }

    return null;
  };

  const renderUploadArea = (documentType: DocumentModel): React.ReactNode => (
    <UploadArea>
      <UploadIcon color="primary" sx={{ fontSize: 40 }} />
      <Typography variant="subtitle1" align="center">
        No document uploaded
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ fontSize: '0.875rem' }}
      >
        Please upload a document to view it here
      </Typography>
    </UploadArea>
  );

  const fetchExistingDocuments = async (): Promise<void> => {
    try {
      setIsInitialLoading(true);
      const response = await getEmployeeDocumentDetailsByUserIdRequest(userId);
      console.log('res is', response);
      const documents = response.employeeDocuments;
      const newDocumentStates: { [key: number]: DocumentState } = {};

      documentTypes.forEach((type) => {
        newDocumentStates[type.id] = {
          file: null,
          preview: false,
          saved: false,
          url: null,
          loading: false
        };
      });

      documents.forEach((doc: any) => {
        newDocumentStates[doc.document_type_id] = {
          file: null,
          preview: true,
          saved: true,
          url: doc.document_url,
          loading: false
        };
      });

      setDocumentStates(newDocumentStates);
    } catch (error) {
      console.error('Error fetching existing documents:', error);
      showSnackbar('Failed to fetch existing documents', 'error');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchDocumentTypes = async (): Promise<void> => {
    try {
      const response = await getDocumentType();
      setDocumentTypes(response.documentTypes);
    } catch (error) {
      console.error('Error fetching document types:', error);
      showSnackbar('Failed to fetch document types', 'error');
    }
  };

  const handleFileUpload = async (documentTypeId: number): Promise<void> => {
    const documentState = documentStates[documentTypeId];

    if (!documentState.file && !documentState.saved) {
      const fileInput = document.getElementById(`file-input-${documentTypeId}`);
      if (fileInput) fileInput.click();
      return;
    }

    if (!documentState.file) {
      showSnackbar('Please select a file to upload', 'error');
      return;
    }

    setDocumentStates((prev) => ({
      ...prev,
      [documentTypeId]: { ...prev[documentTypeId], loading: true }
    }));

    try {
      const formData = new FormData();
      console.log('employeeDocument', documentState.file);
      formData.append('employeeDocument', documentState.file);
      formData.append('documentTypeId', documentTypeId.toString());

      const response: { status: number; data: { document_url: string } } =
        await updateEmployeeDocument(formData, userId);

      if (response.status === 200) {
        setDocumentStates((prev) => ({
          ...prev,
          [documentTypeId]: {
            file: null,
            preview: true,
            saved: true,
            url: response.data.document_url,
            loading: false
          }
        }));

        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeDocumentDetailsUpdated,
          'success'
        );
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.error('Document update error:', error);
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setDocumentStates((prev) => ({
        ...prev,
        [documentTypeId]: { ...prev[documentTypeId], loading: false }
      }));
    }
  };

  useEffect(() => {
    if (documentTypes.length > 0) {
      fetchExistingDocuments();
    }
  }, [documentTypes, userId]);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  return (
    <AdminDashboardPage title="My Profile - Document  Details">
      <Grid container spacing={3}>
        {isInitialLoading ? (
          <Grid
            container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Loader />
          </Grid>
        ) : (
          <>
            {documentTypes.map((documentType) => {
              const documentState = documentStates[documentType.id] || {
                file: null,
                preview: false,
                saved: false,
                url: null,
                loading: false
              };

              return (
                <>
                  <Grid key={documentType.id} item xs={12} sm={6}>
                    <CustomField
                      name={`documentDetails.${documentType.id}`}
                      label={documentType.name}
                    >
                      <UploadCard elevation={0}>
                        <CardContent>
                          {documentState.preview || isInitialLoading ? (
                            <PreviewContainer>
                              {!isInitialLoading && (
                                <CloseButton
                                  onClick={() =>
                                    handleClearDocument(documentType.id)
                                  }
                                  size="small"
                                >
                                  <CloseIcon />
                                </CloseButton>
                              )}
                              <DocumentPreview>
                                {renderDocumentPreview(documentState)}
                              </DocumentPreview>
                              {!isInitialLoading && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <UploadButton
                                    variant="contained"
                                    onClick={() =>
                                      handleFileUpload(documentType.id)
                                    }
                                    disabled={documentState.loading}
                                    startIcon={<UploadIcon />}
                                  >
                                    {documentState.saved && !documentState.file
                                      ? 'Update Document'
                                      : 'Save Document'}
                                  </UploadButton>
                                </Box>
                              )}
                            </PreviewContainer>
                          ) : (
                            <Box
                              onClick={() => {
                                const fileInput = document.getElementById(
                                  `file-input-${documentType.id}`
                                );
                                if (fileInput) fileInput.click();
                              }}
                            >
                              {renderUploadArea(documentType)}
                            </Box>
                          )}
                          <input
                            id={`file-input-${documentType.id}`}
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(e) =>
                              handleFileChange(e, documentType.id)
                            }
                            style={{ display: 'none' }}
                          />
                        </CardContent>
                      </UploadCard>
                    </CustomField>
                  </Grid>
                </>
              );
            })}
          </>
        )}
      </Grid>
    </AdminDashboardPage>
  );
};

export default MyDocumentDetails;
