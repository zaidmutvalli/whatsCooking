export default function InputBox({placeholderText, buttonText, onButtonClick}) {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <input 
                type="text" 
                placeholder={placeholderText} 
                style={{padding: '10px', fontSize: '16px', flex: 1, marginRight: '10px'}}
            />
            <button 
                onClick={onButtonClick} 
                style={{padding: '10px 20px', fontSize: '16px', cursor: 'pointer'}}
            >
                {buttonText}
            </button>
        </div>
    );
}