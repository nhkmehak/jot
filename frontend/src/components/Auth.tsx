import {Link} from "react-router-dom"

export const Auth = ()=>
{
return(
    <>
    <div className="flex items-center flex-col">
        <div className=" text-2xl text-bold ">
Create an account 
        </div>
        <div className="flex">
        <div>
            Already have an account?
            <Link className=" text-semibold pl-2 underline"to="/signin">
Login
            </Link>
        </div>
</div>
<div className="h-14">

</div>
<div className="text-l text-bold">
    Username
</div>
 </div>

    </>
)
}