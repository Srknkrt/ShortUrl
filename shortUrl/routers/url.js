const express = require("express")
const validUrl = require("valid-url")
const shortId = require("short-id-gen")
const Url = require("../models/Url")
 
const router = express.Router()

router.get("/health", (req, res) => {
  return res.status(200).json({ message: "Application is healthy" })
})

router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body
  let { urlCode } = req.body
  const baseUrl = process.env.baseUrl
 
  if (!validUrl.isUri(baseUrl)) {
    return res.status(400).json({ message: "Invalid base url" })
  }
 
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl })
      if (url) {
        console.log("Already exists...")
        return res.status(201).json({ data: url })
      } else {
        if(urlCode === undefined){
          urlCode = shortId.generate(6)
        }
        
        console.log("urlCode: " + urlCode)
        let shortUrl = baseUrl + "/" + urlCode

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        })
 
        console.log("Saving new record...")
        await url.save()
        return res.status(201).json({ data: url })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Some error has occurred" })
    }
  } else {
    return res.status(400).json({ message: "Invalid long url" })
  }
})
 
router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code })
 
    if (url) {
      console.log("Long url found for short url. Redirecting...")
      return res.redirect(url.longUrl)
    } else {
      return res.status(404).json({ message: "No url found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Some error has occurred" })
  }
})
 
module.exports = router