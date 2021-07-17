/**
 * Copy from: https://react-dropzone.js.org/#section-styling-dropzone
 */


/*
 import React from 'react';
import { useDropzone, Dropzone, FlexList } from '@procore/core-react';


export default function CustomDropzone(props) {
  const { onDropAccepted } = props;
  const [acceptedFiles, setAcceptedFiles] = React.useState([])

  const onDrop = newFiles => {
    setAcceptedFiles(prev => [...prev, ...newFiles])
  }

  const dropzoneState = useDropzone({multiple: true, accept: ".pdf", onDrop, onDropAccepted, value: acceptedFiles, maxFileNumber: 5})

  return (
    <div>
      <Dropzone {...dropzoneState} />
      <FlexList wrap="wrap" direction="column" space="xs">
        {acceptedFiles.map((file, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <div>{file.name}</div>
          </div>
        ))}
      </FlexList>
    </div>
  )
}
*/
export {}