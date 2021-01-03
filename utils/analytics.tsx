export const analytics = () => {
  if (typeof window.firebase !== 'undefined') {
    window.firebase.analytics()
  }
}

export const logEvent = (eventName: string, eventParams: any) => {
  if (typeof window.firebase !== 'undefined') {
    window.firebase.analytics().logEvent(eventName, eventParams)
  }
}

export const Events = {
  Link: {
    Clicked: 'Clicked',
  },
}
