import AdminNavbar from "./AdminNavbar";
import ClubNavbar from "./ClubNavbar";
import SocioNavbar from "./SocioNavbar";


interface Props {
    rol: 'ADMIN' | 'CLUB' | 'USER';
  }
  
  const Navbar = ({ rol }: Props) => {
    switch (rol) {
      case 'ADMIN':
        return (
          <AdminNavbar/>
        )
      case 'CLUB':
        return (
        <ClubNavbar/>
        );
      case 'USER':
        return (
          <SocioNavbar/>
        );
      default:
        return null;
    }
  };
  
  export default Navbar;
  