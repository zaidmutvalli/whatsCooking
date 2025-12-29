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
                <hr color="grey" height="1px"></hr>
                <a href="/signup" class="button">Create New Account</a>
            </form>

        </div>
    );
}