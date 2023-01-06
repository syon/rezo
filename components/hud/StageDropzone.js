import Dropzone from 'react-dropzone'
import { useSelector, useDispatch } from 'react-redux'
import Rezo from '../../lib/Rezo'
import { rd } from '../../store/rootSlice'

export default function StageDropzone(props) {
  const drop = useSelector((state) => state.rezo.stage.drop)
  const dispatch = useDispatch()

  if (!drop) {
    return null
  }

  const onDrop = async (acceptedFiles) => {
    const savedata = await Rezo.receiveJsonFile(acceptedFiles)
    dispatch(rd.loadSaveData(savedata))
  }

  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section
          className="absolute top-0 left-0 w-screen h-screen bg-blue-200"
          {...getRootProps()}
        >
          <div>
            <input {...getInputProps()} />
            <p>Drag drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  )
}
