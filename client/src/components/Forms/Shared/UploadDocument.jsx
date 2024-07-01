import { pdfIcon } from "constants/Images";

export default function UploadDocument(props) {
  let {
    selectedDocs,
    errorMsg,
    setSelectedDocs,
    MediaName,
    mediaMaxLen,
    meidaAcceptedExtensions,
    setErrorMsg,
    title,
  } = props;
  function removeSelectedDoc(index) {
    let updatedDocs = [...selectedDocs];
    updatedDocs.splice(index, 1);
    // when removing
    setSelectedDocs(updatedDocs);
  }

  function handleMultiMediaValidation(e) {
    // selectedDocs stores all media
    //each media type (has spesific lenght) so i need to check the lenght based on media type
    // not array length
    const count = selectedDocs?.filter(
      (item) => item?.keyWord === MediaName
    )?.length;

    // max docs lenght is 3
    if (count >= mediaMaxLen) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [MediaName]: `Max length is ${mediaMaxLen}`,
      }));
      return;
    }
    // clear error message
    setErrorMsg((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[MediaName];
      return newErrors;
    });
    const acceptedExtensions = meidaAcceptedExtensions;
    const fileType = e.type;

    const isAcceptedType = acceptedExtensions?.some((extension) =>
      fileType?.toLowerCase()?.includes(extension?.toLowerCase())
    );

    if (!isAcceptedType) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [MediaName]:
          // "Invalid file format. Only pdf, png, jpeg, jpg, mp4 allowed"
          `Invalid file format. Only ${acceptedExtensions.join(
            ", "
          )} are allowed`,
      }));
      return;
    }

    const mediaNameExists = selectedDocs?.some(
      (item) => item?.pdfFile?.name === e?.name && item?.keyWord === MediaName
    );

    // if image aleady exisit
    if (mediaNameExists) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [MediaName]: "Media already exists",
      }));
      return;
    }
    let updatedDocs = [...selectedDocs];

    // Image loaded successfully
    const reader = new FileReader();
    reader.onloadend = () => {
      updatedDocs.push({
        keyWord: MediaName,
        pdfFile: e,
        imageReaderURL: reader.result,
        onprogress: 100,
      });

      setSelectedDocs(updatedDocs);
      const coverImgInput = document?.getElementById(MediaName);
      if (coverImgInput) {
        coverImgInput.value = "";
      }
    };

    reader.onprogress = (event) => {
      // Calculate and show the loading percentage
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
      }
    };

    reader.onerror = () => {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [MediaName]: "Error loading image",
      }));
    };

    reader.readAsDataURL(e);
  }

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMultiMediaValidation(files[0], MediaName);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleMultiMediaValidation(files[0], MediaName);
    }
    e.target.classList.remove("highlight");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.classList.add("highlight");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.classList.remove("highlight");
  };
  return (
    <div className="col-12">
      <div className="form-group gap">
        <label className="form-title">{title} </label>
        <label
          className="mb-0 drop-drag-area p-5 text-center cursor w-100"
          htmlFor={MediaName}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          Drag and drop files here or click to select files
          <input
            type="file"
            id={MediaName}
            hidden
            onChange={handleFileChange}
          />
        </label>
        <small className="form-text small-note">
          Only {meidaAcceptedExtensions.join(" ")} are allowed. A maximum of
          {mediaMaxLen}
          pictures is permitted.
        </small>
        <small className="text-danger">{errorMsg?.[MediaName]}</small>

        {selectedDocs?.map(
          (item, index) =>
            item.keyWord === MediaName && (
              <div key={index} className="col-12 img-uploaded">
                <div className="d-flex justify-content-between align-items-center img-cont-file">
                  <div className="d-flex justify-content-start align-items-center">
                    <img
                      alt={`img ${index}`}
                      src={
                        item?.pdfFile?.name?.includes("pdf")
                          ? pdfIcon
                          : item.imageReaderURL
                      }
                      className="image-upload-file me-3"
                    />
                  </div>
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p>{item?.pdfFile?.name}</p>
                        <p>{(item?.pdfFile?.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <div
                        onClick={() => removeSelectedDoc(index)}
                        className="cursor"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <progress
                        className="w-100"
                        id="progressBar"
                        max="100"
                        value={item?.onprogress || 0}
                      ></progress>
                      {item?.onprogress}%
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
