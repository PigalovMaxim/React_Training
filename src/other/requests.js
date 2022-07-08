export async function registration(
  email,
  name,
  password,
  password_confirmation
) {
  if (
    !(
      email !== "" &&
      name !== "" &&
      password !== "" &&
      password_confirmation !== ""
    )
  )
    return;
  const FORM_DATA = new FormData();
  FORM_DATA.append("email", email);
  FORM_DATA.append("name", name);
  FORM_DATA.append("password", password);
  FORM_DATA.append("password_confirmation", password_confirmation);
  const ANSWER = await fetch(
    "https://internsapi.public.osora.ru/api/auth/signup",
    {
      method: "POST",
      body: FORM_DATA,
    }
  );
  const RESULT = await ANSWER.json();
  return RESULT;
}
export async function login(email, password) {
  if (!(email !== "" && password !== "")) return;
  const FORM_DATA = new FormData();
  FORM_DATA.append("email", email);
  FORM_DATA.append("password", password);
  const ANSWER = await fetch(
    "https://internsapi.public.osora.ru/api/auth/login",
    {
      method: "POST",
      body: FORM_DATA,
    }
  );
  const RESULT = await ANSWER.json();
  return RESULT;
}
export async function startGame(difficult, token) {
  if (!(difficult !== "" && token !== "")) return;
  const FORM_DATA = new FormData();
  FORM_DATA.append("type_hard", difficult);
  FORM_DATA.append("type", 1);
  const ANSWER = await fetch(
    "https://internsapi.public.osora.ru/api/game/play",
    {
      method: "POST",
      body: FORM_DATA,
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  );
  const RESULT = await ANSWER.json();
  return RESULT;
}
export async function answerQuestion(answer, difficult, token) {
  if (!answer) return;
  const FORM_DATA = new FormData();
  FORM_DATA.append("type_hard", difficult);
  FORM_DATA.append("answer", answer);
  FORM_DATA.append("type", 2);
  const ANSWER = await fetch(
    "https://internsapi.public.osora.ru/api/game/play",
    {
      method: "POST",
      body: FORM_DATA,
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  );
  const RESULT = await ANSWER.json();
  return RESULT;
}
