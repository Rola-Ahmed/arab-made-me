import { LoginTimes } from "../../database/models/login_times.model.js"

export const checkLoginTimes = async (userId) => {
    let loginTimes = await LoginTimes.findOne({ where: { userId } })
    console.log("coming");
    console.log(loginTimes);

    if (!loginTimes) {
        loginTimes = await LoginTimes.create({ userId })
        console.log("new creation");
        console.log(loginTimes);
        return true
    }
    else {
        if (loginTimes.expirationDate <= new Date()) {
            await loginTimes.destroy()
            loginTimes = await LoginTimes.create({ userId })
            console.log("new creation after expiration");
            console.log(loginTimes);
            return true
        }
        else {
            if (loginTimes.times > 5) {
                console.log("limit exceeded");
                console.log(loginTimes);
                return false
            }
            else {
                loginTimes.times = loginTimes.times + 1
                await loginTimes.save()
                console.log("available");
                console.log(loginTimes);
                return true
            }
        }
    }
    
}