import { render,screen} from "@testing-library/react"
import Whatsup from "./Whatsup"
import user from "@testing-library/user-event"
import axios from "axios"
jest.mock('axios',()=>{
    return{
        get:jest.fn(),
        post:jest.fn(),
        put:jest.fn()
     };
});
test("rendering whatsup correctly",async()=>{
    render(<Whatsup/>)
    const namefield = screen.getByPlaceholderText("Enter Number")
    expect(namefield).toBeInTheDocument();
    const passfield = screen.getByPlaceholderText("Enter Password")
    expect(passfield).toBeInTheDocument();
    const submitbutton=screen.getByPlaceholderText("Submit")
    expect(submitbutton).toBeInTheDocument();
    const signupbutton=screen.getByPlaceholderText("Sign up")
    expect(signupbutton).toBeInTheDocument();
    user.click(signupbutton);
    const namefield_sign = screen.getByPlaceholderText("Enter Number")
    expect(namefield_sign).toBeInTheDocument();
    const passfield_sign = screen.getByPlaceholderText("Enter Password")
    expect(passfield_sign).toBeInTheDocument();
    const username_sign = screen.getByPlaceholderText("Enter UserName")
    expect(username_sign).toBeInTheDocument();
    const button_sign =screen.getByRole("button")
    expect(button_sign).toBeInTheDocument();
    user.type(passfield_sign,"harsfree12@123")
    user.type(namefield_sign,"9063295863")
    user.type(username_sign,"harsfree12")
    const create="created"
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: create }));
    user.click(button_sign)
    const namefield1 = await screen.findByTestId("number")
    expect(namefield1).toBeInTheDocument();
    const passfield1 =await screen.findByTestId("password")
    expect(passfield1).toBeInTheDocument();
    const submitbutton1=await screen.findByTestId("submit")
    expect(submitbutton1).toBeInTheDocument();
    const signupbutton1=await screen.findByTestId("signup")
    expect(signupbutton1).toBeInTheDocument();
    const data1 = "harsfree"
    const data2 = true
    const unique= 344
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: data2 }));
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: data1 }));
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: unique }));
    user.click(submitbutton1);
    const title=await screen.findByTestId("paragraph");
    expect(title).toBeInTheDocument();
    const title1=screen.getByText("Chatroom harsfree")
    expect(title1).toBeInTheDocument();
    const onlinelist=[{
        image:"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",
        login:true,
        username:"harsfree"
    },
    {
        image:"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",
        login:false,
        username:"gresshma"
    },
    {
        image:"pK0eWIOFVB6NWS0b2BiUwfEBpyhUw4lPhUR2wEIRCOginuFfcaB0I+1YlDTMvcnDPHzHwG2tWzk7L0i8fGJSYt6MUK5jJtQgFsVuncUZTGmsnwFpDQiq+2Uo8cTCWNSv62WZFpqGG/Et5Sv8AUVSfQu4GG3mKrw/FStIs2RQRBuZlpMZTv4kqQ4qciWCKQVEBmvcGcjElQImoQUcsoBEgopGXlGAbxqMwFco9Jop6uLGm6qANsXOYW56ujzMkDnEBbYglqTJACmFw0T+cv01EBgtMZFXniM9jRowMv82IjdY4WEfwlJMVmldysU3o2KfhcHCELcPgMBM7A+RJ5CKRiy2YFvB9xM1uilWbeG1gr8ziaruINwEnXlh+UgYO51d7JO5KZbLixi5cWUiG0tmAoKJb1ESRF08RbvexG5t5CyZvP8yCAEANhLixC7jG1obY/nCV0H7FoPtR5BqFSzxK7ARHUtW5j9iPl5QCKko9SqiZS3F9wRwkdBY5OIFBKeGE2TDzwYnOqmKXW5pglIsctSu5iwylPatL/sIeYJrCPtg3rg6ndQ15NWfwkFRToxflKmEtiYDzLoKpZnEm8lGesvsqFl2y4DCU9xBlBUpjbGECilZUeIUlcDDX2kfbOm4FtqSAgMrzAXZCczDxYtQO5VKOiUpxmUN0fLXxcuWqjg0261pAUmS0TzNkImCIfxKmJwtlWbRVhRBsUVMYnduUREN5g9m0XOJf9wA3WC5dBpM+oWBG/IzBowTJ1Mho6KmLDZsCMynTDhjjPmGDPEXoqPlfBaAsbHxCzvIctwAW38VKDJMniPaH2oRBiAd03HqYJW3hcaGIatwOby7gegl4WjS29GICx8TApEadkSQpqd3aEEFrbA4h6cTeRjKleI9KpyCBp9ltipEWI9ynluI5ExZBkf5EdBS0zbA2YhfZ3DBdIRDzgxPWd3hS1xUqOK4aRHTTl8R9kAXPmVS4X7DIc21KMTNHxK6mDiFZjZRaFTjHLCsvEBmmcswFFEB5gVxETGYJC+4e5SO8jiNE8M0EMCxUwKuLepXbQoY0gK4KgPDrJMeC2Kphu6hytspWwZF79wwonZ09QDFY2n7QLctMRymhcwTDzUQoi/as4BxcU0qXGGkI4lKmQMmI2jQIodmM+YSdYSK2dU1XidO3FEt4a47i4vLhLqoFyoxs9DLtKI0rFM1uWuWYpbOPi4VMmE0dQsYLTKexTjHxcODLx8AoAS5h7GZQQ+kGb23LgyvUvoVCJukKiyUjURsMkioVqkr1FlmaLlNq4JcAulAsFFjhC3WoA15gQayM43CqriCcasLmjoPUFvj7lVbzxKhgjyOROCuF54j4cHS3ZDVoHoXG94cXR+ZtOq9IXhrBeyJPNNooILsHQU8QqLQvJLjCIhS0WOVcsF3ca7v+ZUSdg/wgPaiE4yQlwzMXqhy1HhcRdh7mLO7uXzBvIsyf5oYLP5jmo3A01/MWLk04s9w1v5IXFXSxUdVNunUvCQ0Es7LyQxtbll6boMWdRURBTAyDUhl5ARNKUpgWKOB2ukgNVVxbSyp+w7HAGZCusp1FrAuSBTwdyn8pCsZoZ8Jllm/DmUCoB3M+ZYqoF5lDmJAUO5er1oHbL+WK1MHIShJjhh2blZxLLcMcIKHZXVHEczH3GrYbYsBsJwoM7U5aw/Et5cNTMW9Y/EqK1ZLUVfEe6afzFxCKuEl684Mq3OVe8w5dYYJoaiQ8BHxpbT3LIGG8f3EyoFXDYt0QQHVabjEsiIayy1VeWcAZdExvhU5Yy4vaaUbiDSRpKScypUtJaACGckC7uFzGLlNsTR8LZSkFYYhW5csCxpjQDN7IlUcWywV9p6gX7XuCLCOWIga3dzgRX5mQ5oJjEZZ/Cr1KZlwVcLM31NLkliWoMQTmvK8PwwjLcO/WLSOaGlINn3gLeCJLKzdOSUKGoIQheqax2PEoyPlrjDC4SUb7vsfzFujMIAp4T/bLV8pecoDOglHwJPrMD2Qfx8AYDTLdoEBe5lEfFkxLELOSKRu1lkrkcY0yoFsg4WvMU1DqZnTHH+bFQh61CKhdGvymd2qvYP7DnCOqdNm5blA1pbDmCMQ53gnDnuWQo",
        login:false,
        username:"karthick"
    }]
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: onlinelist }));
    const names1=await screen.findByTestId("testid-2")
    expect(names1).toBeInTheDocument();
    const names=await screen.findByTestId("personname")
    expect(names).toBeInTheDocument();
    user.click(names1)
    const names2= await screen.findByTestId("personname")
    expect(names2).toHaveTextContent("karthick");
    const clickperson1=await screen.findByTestId("clickperson")
    expect(clickperson1).toHaveTextContent("karthick")
    const messageinput=screen.getByPlaceholderText("Enter the message");
    expect(messageinput).toBeInTheDocument();
    user.type(messageinput,"hi automating testing")
    const sendbutton=await screen.findByTestId("sendbutton")
    expect(sendbutton).toBeInTheDocument();
    
    user.click(sendbutton);
    const messagername=await screen.findByTestId("chatmessagesname")
    expect(messagername).toBeInTheDocument();
    expect(messagername).toHaveTextContent("harsfree");
    const message=await screen.findByTestId("chatmessages")
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent("hi automating testing");
    const logoutbutton=await screen.findByTestId("logout")
    expect(logoutbutton).toBeInTheDocument();
    axios.put.mockImplementationOnce(() => Promise.resolve());
    user.click(logoutbutton)
    
})