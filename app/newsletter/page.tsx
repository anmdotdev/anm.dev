import { permanentRedirect } from 'next/navigation'

const NewsletterPage = () => {
  permanentRedirect('/blog#newsletter')
}

export default NewsletterPage
