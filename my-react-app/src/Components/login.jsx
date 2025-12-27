export default function login(){
    
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Sign in request sent');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    name="username"
                    type="text" 
                    placeholder=""
                />
                <label htmlFor="password">Password</label>
                <input
                    name="password"
                    type="password" 
                    placeholder="" 
                />
                <button
                    type="submit"
                    style={{width: '90px', padding: '10px 8px', fontSize: '16px', cursor: 'pointer'}}
                >
                    Sign In
                </button>
            </form>

        </div>
    );
}