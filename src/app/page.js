import "../app/style.css";
export default function Home() {
  return (
    <main>
      <section>
        <form>
          <legend>Experience Unlimited Rentals from Your Community!</legend>
          <br></br>
          <fieldset>
            <div class="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input type="email" required />
              <label for="">Email</label>
            </div>
            <div class="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input type="password" required />
              <label for="">Password</label>
            </div>
            <div class="forget">
              <label for="">
                <input type="checkbox" />
                Remember Me
              </label>
              <a href="#">Forget Password</a>
            </div>
          </fieldset>
          <button>Log in</button>
          <div class="register">
            <p>
              Don't have a account <a href="#">Register</a>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
