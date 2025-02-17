import React from 'react'

function AIWidget() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#777777',
        borderColor: '#e1e1e1',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0746f7, #00ddff)',
          borderRadius: '50%',
          width: '100px',
          height: '100px',
          margin: '0 auto',
        }}
      ></div>
      <button
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '4px',
          padding: '10px 20px',
          marginTop: '10px',
        }}
      >
        Нужна консультация?
      </button>
      <p style={{ marginTop: '10px' }}>
        #### Terms and conditions
        <br />
        By clicking Agree, and each time I interact with this AI agent, I
        consent to the recording, storage, and sharing of my communications with
        third-party service providers, and as described in the Privacy Policy.
        If you do not wish to have your conversations recorded, please refrain
        from using this service.
      </p>
    </div>
  )
}

export default AIWidget
