export default function MemoryDialog(props) {
  return (
    <div className="MemoryDialog">
      <input type="checkbox" id="modal-MemoryDialog" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">
            Youve been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div className="modal-action">
            <label htmlFor="modal-MemoryDialog" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
