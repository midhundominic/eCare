import React from 'react'
import styles from "./doctorReg.module.css"
import TextInput from '../../component/Common/TextInput'

const doctorReg = () => {
  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
       <span className={styles.signupSubtitle}>Register a New Doctor</span>
        <form>
           <TextInput
             type="text"
             title="First Name"
             name="f_name"
             placeholder="Enter First Name"
             isRequired={true}
            />
            <TextInput
             type="text"
             title="Last Name"
             name="l_name"
             placeholder="Enter Last Name"
             isRequired={true}
            />
             <label className={styles.inputLabel} htmlFor="gender">Gender</label>
            <select 
              name="gender" 
              value={doctor.gender} 
              onChange={handleChange} 
              className={styles.inputField} 
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            
            <TextInput
             type="text"
             title="Email"
             name="email"
             placeholder="Enter email"
             isRequired={true}
            />
            <TextInput
             type="text"
             title="Phone No"
             name="phone"
             placeholder="Enter Phone number"
             isRequired={true}
            />
            <TextInput
             type="text"
             title="specialization"
             name="specialization"
             placeholder="Enter specialization"
             isRequired={true}
            />
            <TextInput
             type="text"
             title="Username"
             name="username"
             placeholder="Enter Username"
             isRequired={true}
            />
            <TextInput
             type="text"
             title="Password"
             name="password"
             placeholder="Enter Password"
             isRequired={true}
            />
            <TextInput
             type="text"
             title="Confirm Password"
             name="c_password"
             placeholder="Confirm password"
             isRequired={true}
            />
           

        </form>

    </div>
       </div>
  )
}

export default doctorReg

