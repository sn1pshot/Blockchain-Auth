import MyImg from "../Components/Images/MyImg.svg"
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";

function SignIn() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    const { url } = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/user",
    });
    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    push(url);
  };

  return (
    <>
      <div style={{ backgroundColor: '#333', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Courier New', fontSize: '50px', marginBottom: '20px' }}>
          Web3 Authentication
        </h2>
        <img
          src={MyImg} // Replace with the actual URL of your image
          // alt="Example Image"
          style={{ width: '200px', height: '200px', marginBottom: '50px' }} // Adjust width, height, and margins as needed
        />
        <div>
          <button
            style={{
              backgroundColor: '#ADD8E6',
              color: '#000',
              padding: '15px', // Increased button size
              cursor: 'pointer',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px', // Increased text size
              transition: 'background-color 0.3s ease', // Smooth transition on hover
            }}
            onClick={handleAuth}
            onMouseOver={(e) => e.target.style.backgroundColor = 'transparent'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ADD8E6'}
          >
            Authenticate via Metamask
          </button>
        </div>
      </div>
    </>
  );
  
  
  
  
}

export default SignIn;