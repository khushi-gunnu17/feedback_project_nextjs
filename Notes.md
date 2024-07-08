
## Algorithm

code should effectively handles both scenarios of registering a new user and updating an existing but unverified user account with a new password and verification code.

IF existingUserByEmail EXISTS THEN 
    IF existingUserByEmail.isVerified THEN
        success : false,
    ELSE 
        // save the updates user
    END IF 
ELSE 
    // create a new user with the provided details
    // save the new user
END IF 