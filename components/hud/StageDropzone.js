import Dropzone from 'react-dropzone'
import { useSelector, useDispatch } from 'react-redux'
import Rezo from '../../lib/Rezo'
import { sl, rd } from '../../store/rootSlice'
import UploadIcon from './UploadIcon'

export default function StageDropzone(props) {
  const { drop } = useSelector((s) => s.rezo.stage)
  const dispatch = useDispatch()

  if (!drop) {
    return null
  }

  const onDrop = async (acceptedFiles) => {
    const savedataText = await Rezo.receiveJsonFile(acceptedFiles)
    dispatch(rd.importSaveData(savedataText))
  }

  const onClickOutside = () => {
    dispatch(rd.closeStageDropzone())
  }

  return (
    <Dropzone noClick onDrop={onDrop}>
      {({ getRootProps, getInputProps, open }) => (
        <section
          className="StageDropzone absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-slate-500 opacity-75"
          {...getRootProps()}
          onClick={onClickOutside}
        >
          <div>
            <input {...getInputProps()} />
            <p className="text-slate-100">
              <button
                className="btn glass btn-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  open()
                }}
              >
                <UploadIcon />
              </button>
            </p>
          </div>
        </section>
      )}
    </Dropzone>
  )
}
