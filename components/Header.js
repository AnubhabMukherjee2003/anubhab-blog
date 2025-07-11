const Header = () => {
  return (
    <header className="border border-white rounded-t-lg p-8 text-center">
      <h1 className="m-0 font-mono text-[clamp(0.3rem,1.5vw,0.7rem)] leading-none text-white md:text-[clamp(0.25rem,2vw,0.5rem)] sm:text-[clamp(0.2rem,2.5vw,0.4rem)]">
        <pre className="m-0 p-0 font-mono text-[clamp(0.3rem,1.5vw,0.7rem)] leading-none text-white whitespace-pre overflow-x-auto text-center md:text-[clamp(0.25rem,2vw,0.5rem)] sm:text-[clamp(0.2rem,2.5vw,0.4rem)]">{`████████╗██╗  ██╗ ██████╗ ██╗   ██╗ ██████╗ ██╗  ██╗████████╗███████╗
╚══██╔══╝██║  ██║██╔═══██╗██║   ██║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝
   ██║   ███████║██║   ██║██║   ██║██║  ███╗███████║   ██║   ███████╗
   ██║   ██╔══██║██║   ██║██║   ██║██║   ██║██╔══██║   ██║   ╚════██║
   ██║   ██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝██║  ██║   ██║   ███████║
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝`}</pre>
      </h1>
    </header>
  );
};

export default Header;
