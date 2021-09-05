$(document).ready(function () {
  $.ajax({
    datatype: "json",
    type: "get",
    url: "https://mocki.io/v1/0b4da118-49d2-4862-99d0-31a01630e92b",
    success: function (data) {
      let max = -Infinity;
      let min = Infinity;
      const entries = data[1].entries;
      const roomType = data[0].roomtypes;

      // initialize the filter lists
      let HotelList = entries;
      let searchList = [];
      let priceList = [];
      let propertyList = [];
      let guestRatingList = [];
      let locationList = [];
      let filterHotelList = [];
      let cities = [];
      let minPrice = -1;
      let maxPrice = 0;
      const month30 = [4, 6, 9, 11];
      const month31 = [1, 3, 5, 7, 8, 10, 12];
      let totalDays = 1;

      // ***************************************************
      // ***************************************************
      // capitalize

      const capitalize = function (word) {
        const lower = word.toLowerCase();
        return word.charAt(0).toUpperCase() + lower.slice(1);
      };

      //   **************************************************
      //   **************************************************
      //   HOTEL STARS

      const fillHotelStars = function (hotel, hotelNum) {
        let hotelStars = hotel.rating;
        for (let i = 1; i < hotelStars + 1; i++) {
          $("#" + hotelNum + i).addClass("checked");
        }
      };

      //   **********************************************************
      //   **********************************************************
      //  DESPLAY HOTELS

      // desplay hotel info
      const desplayHotel = function (hotel, hotelNum, totalDays) {
        let hotelPrice = parseInt(hotel.price);
        let totalPrice = totalDays * hotelPrice;
        let str = "";
        if (totalDays > 1) {
          str = " nights";
        } else {
          str = " night";
        }
        $(".all-hotels").append(
          `<div class="row hotel-row">
          <div class=" col-lg-3">
            <img src="` +
            hotel.thumbnail +
            `" alt="hotel pic" />
          </div>
          <div class="col-lg-4 hotel-info r-border outer-info">
          <div id="info">
            <h3>` +
            hotel.hotelName +
            `</h3>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />
  
            <span id='` +
            hotelNum +
            `1' class="fa fa-star "></span>
            <span id='` +
            hotelNum +
            `2' class="fa fa-star "></span>
            <span id='` +
            hotelNum +
            `3' class="fa fa-star "></span>
            <span id='` +
            hotelNum +
            `4' class="fa fa-star "></span>
            <span id='` +
            hotelNum +
            `5' class="fa fa-star "></span>
  
            <p id="distance">` +
            hotel.city +
            `</p>
            <p id="guest-rating">
              <strong id="rating-num">` +
            hotel.ratings.no +
            `</strong> ` +
            hotel.ratings.text +
            ` (1736 reviews)
            </p>
            <p>Excellent location(9.4/10)</p>
            </div>
          </div>
              <div class="col-lg-2 col-sm-5 min-height outer-websites r-border">
                <div class="hotel-website">
                  <p>Hotel website:</p>
                  <p>` +
            hotel.price +
            `</p>
                </div><br>
                <div class="websites">
                  <p>Agoda:</p>
                  <p>$575</p>
                </div><br>
                <div class="websites b-border">
                  <p>Travelcity:</p>
                  <p>$706</p>
                </div><br>
                <div class="more-deals">
                  <label for="deals"><strong>More Deals From</strong></label><br>
                  <select name="deals" id="deals">
                    <option>$532</option>
                    <option>$634</option>
                    <option>&590</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-3 col-sm-7 min-height outer-total-cost">
                <div id="total-cost">
                      <p class="card-title"><strong>Hotel Website</strong></p>
                      <h2>` +
            hotel.price +
            `</h2>
                      <p class="total-cost-info">
                      ` +
            totalDays +
            str +
            ` for <strong class="total-price">$ ` +
            totalPrice +
            `</strong>
                      </p>
                      </div>
                      <div class="deal-button">
                        <button id='deal-button' class="btn btn-success"> View Deal <i class="fa fa-chevron-right"></i></button>
                      
                    </div>
                  </div>
        </div>`
        );
      };

      // desplay all hotels
      const despalyAllHotels = function (HotelList, totalDays) {
        let hotelNum = 1;
        HotelList.forEach((hotel) => {
          desplayHotel(hotel, hotelNum, totalDays);
          fillHotelStars(hotel, hotelNum);
          hotelNum += 1;
        });
      };

      //   ******************************************************
      //   ******************************************************
      //   FILL THE NAV SEARCH INPUTS

      //   fill location selection
      const fillLocationSelection = function (entries) {
        let citysList = [];
        entries.forEach((hotel) => {
          // check if the city not exists in selection
          if (!citysList.includes(hotel.city)) {
            citysList.push(hotel.city);
            locationSelection(hotel);
          }
        });
      };

      // program to check leap year
      function checkLeapYear(year) {
        //three conditions to find out the leap year
        if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
          return true;
        } else {
          return false;
        }
      }

      // take current and the next day in the check-in, check-out calendar
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let yyyy = today.getFullYear();
      // the next day
      var dd2 = String(today.getDate() + 1).padStart(2, "0");

      today = yyyy + "-" + mm + "-" + dd;
      let tomorrow = yyyy + "-" + mm + "-" + dd2;

      // set the current and the next date in check-in input
      $("#check-in").val(today);
      $("#check-out").val(tomorrow);
      // set the min attr in check-in, check-out
      $("#check-in").attr("min", today);
      $("#check-out").attr("min", tomorrow);

      // calculate the total days of booking
      const totalBookingdays = function () {
        let checkIn = $("#check-in").val();
        let checkInYear = parseInt(checkIn.substring(0, 4));
        let checkInMonth = parseInt(checkIn.substring(5, 7));
        let checkInDay = parseInt(checkIn.substring(8, 10));

        let checkOut = $("#check-out").val();
        let checkOutYear = parseInt(checkOut.substring(0, 4));
        let checkOutMonth = parseInt(checkOut.substring(5, 7));
        let checkOutDay = parseInt(checkOut.substring(8, 10));

        let daySeconds = 24 * 60 * 60 * 1000;
        let firstDay = new Date(checkInYear, checkInMonth, checkInDay);
        let secondDay = new Date(checkOutYear, checkOutMonth, checkOutDay);

        let bookingDays = Math.round(
          Math.abs((firstDay - secondDay) / daySeconds)
        );
        // check for leap year
        let leapYear = checkLeapYear(checkInYear);

        if (leapYear && checkInMonth == 2 && checkOutMonth > 2) {
          return bookingDays - 2;
        }
        return bookingDays;
      };

      // check-in function
      $("#check-in").on("input", function () {
        let fDay = $(this).val();
        let yyyy = parseInt(fDay.substring(0, 4));
        let mm = parseInt(fDay.substring(5, 7));
        let dd = parseInt(fDay.substring(8, 10));
        let leapYear = checkLeapYear(yyyy);
        let sDay;

        if (dd === 31 && mm === 12) {
          dd = 1;
          mm = 1;
          yyyy += 1;
        } else if (dd === 28 && mm === 2 && !leapYear) {
          dd = 1;
          mm = 3;
        } else if (dd === 29 && mm === 2 && leapYear) {
          dd = 1;
          mm = 3;
        } else if (dd === 30 && month30.includes(mm)) {
          dd = 1;
          mm += 1;
        } else if (dd === 31 && month31.includes(mm)) {
          dd = 1;
          mm += 1;
        } else {
          dd += 1;
        }
        dd = String(dd);
        dd = dd.padStart(2, "0");
        mm = String(mm);
        mm = mm.padStart(2, "0");
        String(yyyy);
        sDay = yyyy + "-" + mm + "-" + dd;

        $("#check-out").val(sDay);
        $("#check-out").attr("min", sDay);

        totalDays = totalBookingdays();
        //clear the html tag ".all-hotels"
        $(".all-hotels").html("");
        // desplay hotel info with new total price
        despalyAllHotels(HotelList, totalDays);
      });

      // check-out function
      $("#check-out").on("input", function () {
        totalDays = totalBookingdays();
        //clear the html tag ".all-hotels"
        $(".all-hotels").html("");
        // desplay hotel info with new total price
        despalyAllHotels(HotelList, totalDays);
      });

      // add the option in the hotel location selection
      const locationSelection = function (hotel) {
        $(".hotel-location").append(
          `
          <option>` +
            hotel.city +
            `</option>`
        );
      };

      // fill the option selection
      const fillSortSelection = function (entrie) {
        let filtersList = [];
        entries.forEach((hotel) => {
          hotel.filters.forEach((filter) => {
            // check if the filter exist in selection options
            if (!filtersList.includes(filter.name)) {
              filtersList.push(filter.name);
              sortSelection(filter.name);
            }
          });
        });
      };

      // fill the room type selection
      const fillRoomTypeSelection = function (roomType) {
        roomType.forEach((type) => {
          $(".room-type").append(
            `
            <option>` +
              type.name +
              `</option>`
          );
        });
      };

      // add the option for sorting selection
      const sortSelection = function (filter) {
        $(".sort-selection").append(
          `
          <option>` +
            filter +
            `</option>`
        );
      };

      // put the min, max end cuurent price in slider

      // check for min and max price
      const minMaxPrices = function (entries) {
        entries.forEach((hotel) => {
          if (hotel.price > maxPrice) {
            maxPrice = hotel.price;
          }
          if (minPrice === -1) {
            minPrice = hotel.price;
          } else if (hotel.price < minPrice) {
            minPrice = hotel.price;
          }
        });
      };

      // call the function
      minMaxPrices(entries);

      // set the min and max attributes in slider
      $("#formControlRange").attr({
        max: maxPrice,
        min: minPrice,
      });

      // set the init price max
      $("#formControlRange").val(maxPrice);

      // display the min and max value
      $("#min-price").html("min: $" + minPrice);
      $("#max-price").html("max: $" + maxPrice);
      $("#formControlRange").on("input", function () {
        let currentValue = +$(this).val();
        $("#current-price").html("$" + currentValue);
      });

      // ****************************************************
      // ****************************************************
      // MODAL
      // Get the modal
      let modal = document.getElementById("myModal");

      // Get the button that opens the modal
      let btn = document.getElementById("map-button");

      // Get the <span> element that closes the modal
      let span = document.getElementsByClassName("close")[0];

      // When the user clicks the button, open the modal
      btn.onclick = function () {
        // display the first url from HotelList
        let mapUrl = HotelList[0].mapurl;
        $("#map-iframe").attr("src", mapUrl);
        modal.style.display = "block";
      };

      // When the user clicks on <span> (x), close the modal
      span.onclick = function () {
        modal.style.display = "none";
      };

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
      //   *****************************************************
      //   *****************************************************
      //   SEARCH

      // autocomplete -- by codingNepal --> https://www.youtube.com/watch?v=QxMBHi_ZiT8

      // take all the cities
      const allCityes = function (entries) {
        entries.forEach((hotel) => {
          // check for duble cities
          if (!cities.includes(hotel.city)) {
            cities.push(hotel.city);
          }
        });
      };

      // put cities in a cities list
      allCityes(entries);
      const searchWrapper = document.querySelector(".search-input");
      const inputBox = searchWrapper.querySelector("input");
      const suggBox = searchWrapper.querySelector(".autocom-box");

      inputBox.onkeyup = (e) => {
        // user entered data
        let userData = e.target.value;
        let emptyArray = [];
        if (userData) {
          emptyArray = cities.filter((data) => {
            // filtering array value and user char to lowecase and
            //return only those cities which are start with user entered word
            return data
              .toLocaleLowerCase()
              .startsWith(userData.toLocaleLowerCase());
          });
          emptyArray = emptyArray.map((data) => {
            return (data = `<li>` + data + `</li>`);
          });
          // show autocomplete box
          searchWrapper.classList.add("active");
          showSuggestions(emptyArray);
          let allList = suggBox.querySelectorAll("li");
          for (let i = 0; i < allList.length; i++) {
            // adding onclick attribute in all li tag
            allList[i].onclick = function () {
              let selectUserData = this.textContent;
              // passing the user selected list item data in textfield
              inputBox.value = selectUserData;
              // hide autocomplete box
              searchWrapper.classList.remove("active");
            };
          }
        } else {
          // hide autocomplete box
          searchWrapper.classList.remove("active");
        }
      };

      const showSuggestions = function (list) {
        let listData;
        if (!list.length) {
          userValue = inputBox.value;
          listData = `<li>` + userValue + `</li>`;
        } else {
          listData = list.join("");
        }
        suggBox.innerHTML = listData;
      };

      //   *********************************************************
      //   *********************************************************
      //   FILTERING

      const mainFilterFuncction = function () {
        //clear the html tag ".all-hotels"
        $(".all-hotels").html("");
        // take the hotel from search input
        let searchInput = $("#search-input").val();
        searchInput = capitalize(searchInput);
        searchList = searchFunction(searchInput);

        // take the hotel price
        let cPrice = $("#formControlRange").val();
        priceList = priceFunction(cPrice);

        // // fill the property list
        propertyList = prorpertyTypeFunction();

        // fill the guestRating list
        guestRatingList = guestRatingFunction();

        // fill the location list
        locationList = locationFunction();

        // fiil the sortlist
        let filter = $(".sort-selection").val();
        filterHotelList = sortHotelFunction(filter);

        // final list
        finalListFunction();

        // desplay all the hotels after filtering
        if (HotelList.length > 0) {
          // $(".all-hotels").html("");
          despalyAllHotels(HotelList, totalDays);
        } else {
          $(".all-hotels").append(
            `<div class="row hotel-row"><h3>~ No results </h3></div>`
          );
        }
      };

      // search function
      const searchFunction = function (input) {
        searchList = [];
        if (input === "") {
          return entries;
        } else {
          entries.forEach((hotel) => {
            if (hotel.city === input) {
              searchList.push(hotel);
            }
          });
          return searchList;
        }
      };

      // on clich search button
      $("#search-button").on("click", function () {
        let loc = $("#search-input").val();
        loc = capitalize(loc);
        // put in location selector the value from search input
        if (loc === "") {
          $(".hotel-location").val("all");
        } else {
          $(".hotel-location").val(loc);
        }

        // call the main filter function
        mainFilterFuncction();
      });

      // price function
      const priceFunction = function (price) {
        priceList = [];
        entries.forEach((hotel) => {
          if (hotel.price <= price) {
            priceList.push(hotel);
          }
        });
        return priceList;
      };

      // on input price
      $("#formControlRange").on("input", function () {
        // call the main filter function
        mainFilterFuncction();
      });

      // property function
      const prorpertyTypeFunction = function () {
        propertyList = [];
        // take the property type
        let pType = $(".property-type").val();
        if (pType === "all") {
          return entries;
        } else {
          entries.forEach((hotel) => {
            if (hotel.rating == pType) {
              propertyList.push(hotel);
            }
          });
          return propertyList;
        }
      };

      // on input property type
      $(".property-type").on("input", function () {
        // call the main filter function
        mainFilterFuncction();
      });

      // geust rating function
      const guestRatingFunction = function () {
        guestRatingList = [];
        // take the guest rating input
        let guestInput = $(".guest-rating").val();
        if (guestInput === "all") {
          return entries;
        } else {
          entries.forEach((hotel) => {
            if (hotel.ratings.text == guestInput) {
              guestRatingList.push(hotel);
            }
          });
          return guestRatingList;
        }
      };

      // on input guest rating
      $(".guest-rating").on("input", function () {
        // call the main filter function
        mainFilterFuncction();
      });

      // location function
      const locationFunction = function () {
        locationList = [];
        // take the location input
        let locInput = $(".hotel-location").val();
        if (locInput === "all") {
          return entries;
        } else {
          entries.forEach((hotel) => {
            if (hotel.city == locInput) {
              locationList.push(hotel);
            }
          });
          return locationList;
        }
      };

      // on input location
      $(".hotel-location").on("input", function () {
        let loc = $(this).val();
        // if location selection value is all, put in search value an empty string
        if (loc === "all") {
          $("#search-input").val("");
        } else {
          // put in search value the value from location select
          $("#search-input").val(loc);
        }
        // call the main filter function
        mainFilterFuncction();
      });

      // sorting filter
      const sortHotelFunction = function (filter) {
        filterHotelList = [];
        if (filter === "all") {
          return entries;
        } else {
          entries.forEach((hotel) => {
            hotel.filters.forEach((fNames) => {
              if (fNames.name === filter) {
                filterHotelList.push(hotel);
              }
            });
          });
          return filterHotelList;
        }
      };

      // on input sort filter
      $(".sort-selection").on("input", function () {
        // call the main filter function
        mainFilterFuncction();
      });

      // final list function
      const finalListFunction = function () {
        HotelList = [];
        searchList.forEach((hotel) => {
          if (
            priceList.includes(hotel) &&
            propertyList.includes(hotel) &&
            guestRatingList.includes(hotel) &&
            locationList.includes(hotel) &&
            filterHotelList.includes(hotel)
          ) {
            HotelList.push(hotel);
          }
        });
      };

      //   **************************************************
      //   **************************************************
      //   CALL ALL THE FUCTIONS
      despalyAllHotels(HotelList, totalDays);
      fillLocationSelection(HotelList);
      fillSortSelection(HotelList);
      fillRoomTypeSelection(roomType);
    },

    error: function () {
      $("#ajaxError").append(`<p>Something went wrong</p>`);
    },
  });
});
