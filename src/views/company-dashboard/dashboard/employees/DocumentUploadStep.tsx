import React, { useState } from 'react';
import { Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import * as Yup from 'yup';
import { UploadSingleImage } from 'components/InputFields/upload';
import { CustomField } from 'components/InputFields';
import { AddEmployeeDocumentsFormValues } from 'models/company/employee';
import { DocumentModel } from 'models/company/DocumentType';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { uploadEmployeeDocument } from 'services/company/employee/documentUpload';
import UploadSingleFile from 'components/InputFields/upload/UploadSingleFile';

// Interface for document upload response
interface UploadDocumentResponse {
  status: {
    response_code: number;
    message: string;
  };
}

const DocumentUploadStep: React.FC<{
  values: any;
  setFieldValue: (field: string, value: any) => void;
  documentTypes: DocumentModel[];
  userId: number | null;
  errors: any;
  touched: any;
}> = ({ values, setFieldValue, documentTypes, userId, errors, touched }) => {
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});
  const { showSnackbar } = useSnackbarClose();

  const handleFileUpload = async (
    file: File,
    documentTypeId: number
  ): Promise<void> => {
    setUploading({ ...uploading, [documentTypeId]: true });
    try {
      const formData = new FormData();
      formData.append('employeeDocument', file);
      formData.append('documentTypeId', documentTypeId.toString());
      formData.append('userId', JSON.stringify(12));
      const response = await uploadEmployeeDocument(formData);
      console.log('upload repsonse', response);
      if (response.status === 200) {
        // Update formik values
        const newDocumentDetails = [...values.documentDetails];
        const index = newDocumentDetails.findIndex(
          (doc) => doc.documentTypeId === documentTypeId
        );
        if (index !== -1) {
          newDocumentDetails[index] = {
            documentTypeId,
            employeeDocument: file
          };
        } else {
          newDocumentDetails.push({
            documentTypeId,
            employeeDocument: file
          });
        }
        setFieldValue('documentDetails', newDocumentDetails);
        showSnackbar('Document uploaded successfully', 'success');
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log('Image upload error ', error);
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setUploading({ ...uploading, [documentTypeId]: false });
    }
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-between"
      alignItems="stretch"
    >
      {documentTypes.map((documentType) => {
        const currentDocument = values.documentDetails.find(
          (doc: AddEmployeeDocumentsFormValues) =>
            doc.documentTypeId === documentType.id
        );

        return (
          <Grid key={documentType.id} item xs={12} sm={6} md={6} mt={2}>
            <Card>
              <CardContent>
                <CustomField
                  name={`documentDetails.${documentType.id}`}
                  label={documentType.name}
                >
                  <div className="flex flex-col gap-2">
                    <UploadSingleFile
                      label={`Upload ${documentType.name}`}
                      file={currentDocument?.employeeDocument}
                      loading={uploading[documentType.id]}
                      onFileChange={(file) =>
                        handleFileUpload(file, documentType.id)
                      }
                      error={Boolean(errors)}
                    />
                    {currentDocument?.employeeDocument && (
                      <div className="flex items-center justify-between mt-2">
                        <Typography variant="body2">
                          {typeof currentDocument.employeeDocument === 'string'
                            ? currentDocument.employeeDocument
                            : currentDocument.employeeDocument.name}
                        </Typography>
                      </div>
                    )}
                  </div>
                </CustomField>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DocumentUploadStep;
