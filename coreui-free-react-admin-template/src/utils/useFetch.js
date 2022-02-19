import { useEffect, useState } from 'react'

const useFetch = (req) => {
  const [isFetching, setIsFetching] = useState(false)
  const [reqInfo, setReqInfo] = useState(req)
  const [resInfo, setResInfo] = useState({})
  useEffect(() => {
    if (reqInfo) {
      new Promise((resolve, reject) => {
        const fetchUrl = reqInfo.endPoint
        const fetchData = {
          headers: reqInfo?.headers,
          method: reqInfo.method,
          body: JSON.stringify(reqInfo.requestBody),
        }
        if (fetchUrl) {
          fetch(fetchUrl, fetchData)
            .then((res) => res.json())
            .then((data) => {
              resolve(data)
            })
            .catch((err) => reject(err))
          setIsFetching(true)
        }
      }).then(
        (data) => {
          if (data.error) {
            setResInfo({
              data: data?.message ?? 'Error',
              hasError: true,
            })
          } else {
            setResInfo({
              data: data?.data,
              hasError: false,
            })
          }
          setIsFetching(false)
        },
        (err) => {
          setResInfo({
            data: err,
            hasError: true,
          })
          setIsFetching(false)
        },
      )
    }
  }, [reqInfo])

  return [resInfo, isFetching, setReqInfo]
}

export default useFetch
