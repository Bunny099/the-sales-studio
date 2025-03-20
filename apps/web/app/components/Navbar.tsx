import Logo from "@/icon/Logo"
export default function Navbar(){
    return<>
     <nav className="  flex-wrap  ">
        <div className="bg-gray-700 flex justify-between p-2 rounded-lg text-white mt-2 ">
        <div className="flex items-center">
        <Logo/>
        <p className="text-lg pl-2 hover:cursor-pointer">The Sales Studio</p>
        </div>
        <div>
            <ul className="flex gap-1 cursor-pointer text-lg">
                <li className="pr-2 ">Home</li>
                <li className="pr-2 ">About</li>
                <li className="pr-2 ">Contact</li>
            </ul>
        </div>
        </div>
        
       </nav>
    </>
}