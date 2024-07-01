import { JaaSMeeting } from "@jitsi/react-sdk";

export default function Invitaion() {
  return (
    <JaaSMeeting
      // domain='meet.jit.si'
      // Make sure to include a JWT if you intend to record,
      // make outbound calls or use any other premium features!
      // jwt = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtOGYwM2MwMjAyNWM2NGE5NmI5MTMwZTMzNzAzYzViMzUvNTNkZThmLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3MTgwNDg5OTYsImV4cCI6MTcxODA1NjE5NiwibmJmIjoxNzE4MDQ4OTkxLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtOGYwM2MwMjAyNWM2NGE5NmI5MTMwZTMzNzAzYzViMzUiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTAyNTIwMTU1MjM0Mzc1NDc0NTEyIiwiYXZhdGFyIjoiIiwiZW1haWwiOiJ0ZXN0LnVzZXJAY29tcGFueS5jb20ifX0sInJvb20iOiIqIn0.QmHy1X0vAtmQH9VXdLkN-qb2N2d_4avbE6EXgEZ2uL4q4ESF483AmT1jaP0X0lsHCxbq3_-SvE-_PHQVqjtFqobld3fBjIfSnOsRKRbdXaTVIdv0nwLU0eoxm3CeJH_lMsdIl-zNJr18thhZ8lKNKldArRz3g_RhN5mQxsWW_7eE0ObIdvIbp-CfKsIDl5Zkfhti28954YmjDZezwpZ9F6c6msrmIHZgKYzew0ne2fXX9CKE9dhjk5Dmdi4EWtkKfdcQAsWhUVJE7XuFpUOLUerJ8afP_bEKluaOyu7ll-Uf4mrZr4Dwh-SCMGpk9NFjqRRHSRnHbLNiyfN6OBNS4Q"
      release="release-5082"
      roomName="vpaas-magic-cookie-8f03c02025c64a96b9130e33703c5b35/SampleAppUsedSeparationsRetreatFundamentally"
      getIFrameRef={(iframeRef) => {
        if (iframeRef) {
          iframeRef.style.height = "50vh";
        }
      }}
      isDeviceChangeAvailable={true}
    />
  );
}
