import Image from "next/image";

const HomeLogo = () => {
  return (
    <div
      className="flex"
      style={{
        justifyContent: "flex-start",
        width: "250px",
      }}
    >
      <div>
        <Image
          src="/images/logos/CME.png"
          alt="CME logo"
          height={60}
          width={80}
          priority
        />
      </div>
      <div>
        <Image
          src="/images/logos/logo.png"
          alt="Main logo"
          height={120}
          width={120}
          priority
        />
      </div>
      <div>
        <Image
          src="/images/logos/VisayasMed.png"
          alt="VisayasMed logo"
          height={60}
          width={80}
          priority
        />
      </div>
    </div>
  );
};

export default HomeLogo;
