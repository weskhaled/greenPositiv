const getScore = () => {
  if (!profile.value.freelancer)
    return 0
  const value = 0
  if (profile.value.freelancer.email_verification)
    value += 10

  if (profile.value.freelancer.documents_val)
    value += 30

  if (profile.value.freelancer.validated)
    value += 10

  if (profile.value.freelancer.signed_client)
    value += 10

  if (profile.value.freelancer.description && profile.value.freelancer.description.length != 0)
    value += 10

  if (profile.value.freelancer.skills.length >= 7)
    value += 10

  if (profile.value.freelancer.languages.length >= 1)
    value += 10

  if (profile.value.freelancer.greenQuestion.length >= 1)
    value += 10

  return value
}
