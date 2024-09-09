import { pdfIcon } from "constants/Images";

function removeSelectedDoc(index, selectedDocs, setSelectedDocs) {
  let updatedDocs = [...selectedDocs];
  updatedDocs.splice(index, 1);
  setSelectedDocs(updatedDocs);
}

function handleMultiMediaValidation(
  e,
  selectedDocs,
  setSelectedDocs,
  MediaName,
  mediaMaxLen,
  meidaAcceptedExtensions,
  setErrorMsg
) {
  const count = selectedDocs?.filter((item) => item?.keyWord === MediaName)
    ?.length;

  if (count >= mediaMaxLen) {
    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      [MediaName]: `Max length is ${mediaMaxLen}`,
    }));
    return;
  }

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
      [MediaName]: `Invalid file format. Only ${acceptedExtensions.join(
        ", "
      )} are allowed`,
    }));
    return;
  }

  const mediaNameExists = selectedDocs?.some(
    (item) => item?.pdfFile?.name === e?.name && item?.keyWord === MediaName
  );

  if (mediaNameExists) {
    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      [MediaName]: "Media already exists",
    }));
    return;
  }

  let updatedDocs = [...selectedDocs];

  const reader = new FileReader();
  reader.onloadend = () => {
    updatedDocs.push({
      keyWord: MediaName,
      pdfFile: e,
      imageReaderURL: reader.result,
      onprogress: 100,
    });

    setSelectedDocs(updatedDocs);
    const inputElement = document.querySelector(
      `input[file-id="${MediaName}"]`
    );

    console.log("inputElement", inputElement);
    // Perform actions on the selected element
    if (inputElement) {
      console.log("inputElement enter", inputElement);

      inputElement.value = "";
    }

    // const coverImgInput = document?.getElementById(MediaName);
    // if (coverImgInput) {
    //   coverImgInput.value = "";
    // }
  };

  reader.onprogress = (event) => {
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

const handleFileChange = (
  e,
  selectedDocs,
  setSelectedDocs,
  MediaName,
  mediaMaxLen,
  meidaAcceptedExtensions,
  setErrorMsg
) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    handleMultiMediaValidation(
      files[0],
      selectedDocs,
      setSelectedDocs,
      MediaName,
      mediaMaxLen,
      meidaAcceptedExtensions,
      setErrorMsg
    );
  }
};

const handleDrop = (
  e,
  selectedDocs,
  setSelectedDocs,
  MediaName,
  mediaMaxLen,
  meidaAcceptedExtensions,
  setErrorMsg
) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    handleMultiMediaValidation(
      files[0],
      selectedDocs,
      setSelectedDocs,
      MediaName,
      mediaMaxLen,
      meidaAcceptedExtensions,
      setErrorMsg
    );
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
    smallNote,
  } = props;

  return (
    <div className="col-12">
      <div className="form-group gap">
        <label className="form-title">{title}</label>
        <button
          type="button"
          className="mb-0 drop-drag-area p-5 text-center cursor w-100 bg-white"
          // htmlFor={MediaName}
          onDrop={(e) =>
            handleDrop(
              e,
              selectedDocs,
              setSelectedDocs,
              MediaName,
              mediaMaxLen,
              meidaAcceptedExtensions,
              setErrorMsg
            )
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          Drag and drop files here or click to select files
          <input
            className="border-0 mx-auto d-block"
            type="file"
            id={MediaName}
            file-id={MediaName}
            // hidden
            onChange={(e) =>
              handleFileChange(
                e,
                selectedDocs,
                setSelectedDocs,
                MediaName,
                mediaMaxLen,
                meidaAcceptedExtensions,
                setErrorMsg
              )
            }
          />
        </button>
        <div>
          <small className="form-text small-note d-block">
            Only {meidaAcceptedExtensions.join(" ")} are allowed. A maximum of{" "}
            {mediaMaxLen} pictures is permitted.
          </small>
          {smallNote && (
            <small className="form-text small-note d-block lh-normal">
              {smallNote}
            </small>
          )}
        </div>
        <small className="text-danger lh-normal">{errorMsg?.[MediaName]}</small>

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
                        onClick={() =>
                          removeSelectedDoc(
                            index,
                            selectedDocs,
                            setSelectedDocs
                          )
                        }
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

export function UploadVedio(props) {
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

  return (
    <div className="col-12">
      {/* <div className="grid-gap-col"> */}
      <div className="form-group">
        <label className="form-title">{title}</label>
        <label
          className="mb-0 drop-drag-area p-5 text-center cursor d-block"
          htmlFor={MediaName}
          onDrop={(e) =>
            handleDrop(
              e,
              selectedDocs,
              setSelectedDocs,
              MediaName,
              mediaMaxLen,
              meidaAcceptedExtensions,
              setErrorMsg
            )
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          Drag and drop files here or click to select files
          <input
            type="file"
            id={MediaName}
            hidden
            onChange={(e) =>
              handleFileChange(
                e,
                selectedDocs,
                setSelectedDocs,
                MediaName,
                mediaMaxLen,
                meidaAcceptedExtensions,
                setErrorMsg
              )
            }
          />
        </label>
        <small className="form-text small-note d-block">
          Only {meidaAcceptedExtensions.join(" ")} are allowed. A maximum of{" "}
          {mediaMaxLen} pictures is permitted.
        </small>
        <small className="text-danger">{errorMsg?.[MediaName]}</small>

        {selectedDocs.map(
          (item, index) =>
            item.keyWord === MediaName && (
              <div key={index} className="col-12 img-uploaded">
                <div className="d-flex justify-content-start align-items-center">
                  <video
                    src={item.imageReaderURL}
                    controls="controls"
                    autoPlay={false}
                    muted={true}
                    className="w-100"
                  />
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className=" lh-nomral fw-500 fs-14 text-tarute">
                        {item?.pdfFile?.name}
                      </p>
                      <p className=" lh-nomral fw-500 fs-14">
                        {(item?.pdfFile?.size / 1024)?.toFixed(2)} KB
                      </p>
                    </div>
                    <div
                      onClick={() =>
                        removeSelectedDoc(index, selectedDocs, setSelectedDocs)
                      }
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
            )
        )}
      </div>
      {/* </div> */}
    </div>
  );
}
