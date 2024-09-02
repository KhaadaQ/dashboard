async function validateToken(token) {
    try {
        const response = await fetch("/user/verify-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });
        return response.ok;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
}

async function checkToken() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
        window.location.href = "/";
        return;
    }

    const tokenIsValid = await validateToken(token);

    if (!tokenIsValid) {
        const refresh = await refreshAccessToken(refreshToken);
        if (!refresh) {
            window.location.href = "/";
        }
    }
}

async function refreshAccessToken(refreshToken) {
    try {
        const response = await fetch("/user/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refresh_token);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}
