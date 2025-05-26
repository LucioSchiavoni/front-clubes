// src/components/Navbar.tsx
interface Props {
    role: 'admin' | 'moderador' | 'cliente';
  }
  
  const Navbar = ({ role }: Props) => {
    switch (role) {
      case 'admin':
        return (
          <nav>
            <h2>Admin</h2>
            <ul>
              <li>Usuarios</li>
              <li>Reportes</li>
            </ul>
          </nav>
        );
      case 'moderador':
        return (
          <nav>
            <h2>Moderador</h2>
            <ul>
              <li>Tickets</li>
              <li>Revisiones</li>
            </ul>
          </nav>
        );
      case 'cliente':
        return (
          <nav>
            <h2>Cliente</h2>
            <ul>
              <li>Mis compras</li>
              <li>Soporte</li>
            </ul>
          </nav>
        );
      default:
        return null;
    }
  };
  
  export default Navbar;
  