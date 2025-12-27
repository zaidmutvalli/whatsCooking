export default function login(){
    
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Sign in request sent');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    type="text" 
                    placeholder="Username"
                />
                <input
                    name="password"
                    type="password" 
                    placeholder="Password" 
                />
                <button
                    type="submit"
                >
                    Log In
                </button>
            </form>

        </div>
    );
}