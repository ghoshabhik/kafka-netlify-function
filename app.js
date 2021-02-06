const result = document.querySelector('.result')
const result1 = document.querySelector('.result1')


const form = document.querySelector('.form')
const input = document.querySelector('.form-input')   

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const textContent = input.value
  if (textContent) {
    sendToKafka(textContent)
  }
})

async function sendToKafka(msg) {
  try {
    const { data } = await axios.post(`/api/kafka-producer`, { msg })

    result.innerHTML = `<div>
      <br/>
      <p>The message "${data}" is sent to Kafka</p>
    </div>`
    
    input.value = ''

    const { data1 } = await axios.get(`/api/kafka-consumer`)
  //   result1.innerHTML = `<div>
  //   <br/>
  //   <p>${data1}</p>
  // </div>` 

  } catch (error) {
    console.log(error.response)
  }
}