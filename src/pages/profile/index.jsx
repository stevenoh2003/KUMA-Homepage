import { useSession, signIn, getSession } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"
import { useState } from "react"

export default function Profile() {
  const { data: session, status, mutate } = useSession()
  const loading = status === "loading"

  const [name, setName] = useState(session?.user?.name || "")
  const [image, setImage] = useState(null)

  if (loading) {
    return <p>Loading...</p>
  }

  if (!session || !session.user) {
    return (
      <div>
        <p>You must be logged in to view this page</p>
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("name", name)
    if (image) {
      formData.append("file", image)
    }

    const response = await fetch("/api/user/update", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      const updatedUser = await response.json()
      mutate(
        {
          ...session,
          user: {
            ...session.user,
            ...updatedUser,
          },
        },
        false
      )
    } else {
      console.error("Failed to update profile")
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <div className="container">
        <Head>
          <title>User Profile</title>
        </Head>
        <h1>Profile</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="inputGroup">
            <strong>Name:</strong>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <strong>Email:</strong> {session.user.email}
          </div>
          <div className="inputGroup">
            <strong>Profile Image:</strong>
            {session.user.image && (
              <div className="imageWrapper">
                <Image
                  src={session.user.image}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="profileImage"
                />
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              className="inputFile"
            />
          </div>
          <button type="submit" className="button">
            Update Profile
          </button>
        </form>
        <style jsx>{`
          .container {
            padding: 20px;
            margin: auto;
            max-width: 600px;
            background: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .inputGroup {
            margin-bottom: 20px;
          }

          .input,
          .inputFile {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .button {
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .button:hover {
            background-color: #0056b3;
          }

          .profileImage {
            border-radius: 50%; /* Makes image circular */
            object-fit: cover; /* Ensures the image is not stretched */
          }
        `}</style>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }
  return {
    props: { session },
  }
}
